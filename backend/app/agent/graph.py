import logging
from typing import Annotated, Literal, Optional

from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
)
from langgraph.graph import END, StateGraph
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict

from ..config import Settings
from ..rag.vectorstore import FAISSVectorStore
from .prompts import SYSTEM_PROMPT
from .tools import build_tools

logger = logging.getLogger(__name__)


class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    tool_used: Optional[str]
    final_response: Optional[str]


class LogiAgentGraph:
    def __init__(self, settings: Settings, store: FAISSVectorStore) -> None:
        self.llm = self._build_llm(settings)
        self.tools = build_tools(store, settings)
        self.tool_map = {t.name: t for t in self.tools}
        self.llm_with_tools = self.llm.bind_tools(self.tools)
        self.graph = self._compile()

    def _build_llm(self, settings: Settings):
        if settings.llm_provider == "anthropic":
            from langchain_anthropic import ChatAnthropic

            return ChatAnthropic(
                model=settings.model_name,
                temperature=settings.temperature,
                max_tokens=settings.max_tokens,
                api_key=settings.anthropic_api_key,
            )
        if settings.llm_provider == "groq":
            from langchain_groq import ChatGroq

            return ChatGroq(
                model=settings.model_name,
                temperature=settings.temperature,
                max_tokens=settings.max_tokens,
                api_key=settings.groq_api_key,
            )
        from langchain_openai import ChatOpenAI

        return ChatOpenAI(
            model=settings.model_name,
            temperature=settings.temperature,
            max_tokens=settings.max_tokens,
            api_key=settings.openai_api_key,
        )

    def _compile(self):
        g = StateGraph(AgentState)
        g.add_node("router", self.router_node)
        g.add_node("rag", self.rag_node)
        g.add_node("freight", self.freight_node)
        g.set_entry_point("router")
        g.add_conditional_edges(
            "router",
            self._should_continue,
            {"rag": "rag", "freight": "freight", "end": END},
        )
        g.add_edge("rag", "router")
        g.add_edge("freight", "router")
        return g.compile()

    def _should_continue(
        self, state: AgentState
    ) -> Literal["rag", "freight", "end"]:
        last = state["messages"][-1]
        if not hasattr(last, "tool_calls") or not last.tool_calls:
            return "end"
        return last.tool_calls[0]["name"]

    def router_node(self, state: AgentState) -> dict:
        msgs = [SystemMessage(content=SYSTEM_PROMPT)] + list(state["messages"])
        response: AIMessage = self.llm_with_tools.invoke(msgs)
        if not response.tool_calls:
            return {
                "messages": [response],
                "final_response": response.content,
            }
        return {"messages": [response]}

    def rag_node(self, state: AgentState) -> dict:
        tc = state["messages"][-1].tool_calls[0]
        query: str = tc["args"]["query"]
        result: str = self.tool_map["rag"].invoke(query)
        return {
            "messages": [ToolMessage(content=result, tool_call_id=tc["id"])],
            "tool_used": "rag",
        }

    def freight_node(self, state: AgentState) -> dict:
        tc = state["messages"][-1].tool_calls[0]
        args: dict = tc["args"]
        result: str = self.tool_map["freight"].invoke(args)
        return {
            "messages": [ToolMessage(content=str(result), tool_call_id=tc["id"])],
            "tool_used": "freight",
        }

    async def run(self, message: str) -> AgentState:
        initial: AgentState = {
            "messages": [HumanMessage(content=message)],
            "tool_used": None,
            "final_response": None,
        }
        return await self.graph.ainvoke(initial)
