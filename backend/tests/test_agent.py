import json
import math
import pytest
from unittest.mock import MagicMock

from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

from app.agent.graph import LogiAgentGraph
from app.agent.tools import (
    FreightResult,
    HUB_COORDS,
    RATE_TABLE,
    TRANSIT_DAYS,
    _haversine,
    freight,
    make_rag_tool,
)


@pytest.fixture
def mock_settings() -> MagicMock:
    s = MagicMock()
    s.llm_provider = "openai"
    s.model_name = "gpt-4o-mini"
    s.temperature = 0.0
    s.max_tokens = 512
    return s


# ── _should_continue ───────────────────────────────────────────────────────────

def test_should_continue_no_tool_call(mock_settings: MagicMock):
    graph = LogiAgentGraph.__new__(LogiAgentGraph)
    ai_msg = AIMessage(content="Hello", tool_calls=[])
    state = {"messages": [ai_msg]}
    assert graph._should_continue(state) == "end"


def test_should_continue_rag(mock_settings: MagicMock):
    graph = LogiAgentGraph.__new__(LogiAgentGraph)
    ai_msg = AIMessage(
        content="",
        tool_calls=[{"name": "rag", "args": {"query": "FOB"}, "id": "1", "type": "tool_call"}],
    )
    state = {"messages": [ai_msg]}
    assert graph._should_continue(state) == "rag"


def test_should_continue_freight(mock_settings: MagicMock):
    graph = LogiAgentGraph.__new__(LogiAgentGraph)
    ai_msg = AIMessage(
        content="",
        tool_calls=[{"name": "freight", "args": {}, "id": "2", "type": "tool_call"}],
    )
    state = {"messages": [ai_msg]}
    assert graph._should_continue(state) == "freight"


# ── _haversine ─────────────────────────────────────────────────────────────────

def test_haversine_same_point():
    assert _haversine(0, 0, 0, 0) == pytest.approx(0.0)


def test_haversine_known_distance():
    # Mumbai → Dubai: ~1940km
    lat1, lon1 = HUB_COORDS["mumbai"]
    lat2, lon2 = HUB_COORDS["dubai"]
    dist = _haversine(lat1, lon1, lat2, lon2)
    assert 1800 < dist < 2100


# ── freight tool ───────────────────────────────────────────────────────────────

def test_freight_valid_air():
    result_json = freight.invoke(
        {"origin": "Mumbai", "destination": "Frankfurt", "weight_kg": 100.0, "mode": "air"}
    )
    data = json.loads(result_json)
    assert data["origin"] == "Mumbai"
    assert data["mode"] == "air"
    assert data["total_cost_usd"] > 0
    assert data["currency"] == "USD"
    assert "business days" in data["transit_days"]


def test_freight_unknown_city():
    result = freight.invoke(
        {"origin": "Atlantis", "destination": "Mumbai", "weight_kg": 50.0, "mode": "air"}
    )
    assert "Unknown city" in result
    assert "Supported hubs" in result


def test_freight_unknown_mode():
    result = freight.invoke(
        {"origin": "Mumbai", "destination": "Dubai", "weight_kg": 50.0, "mode": "helicopter"}
    )
    assert "Unknown mode" in result


def test_freight_sea_mode():
    result_json = freight.invoke(
        {"origin": "Shanghai", "destination": "Rotterdam", "weight_kg": 1000.0, "mode": "sea"}
    )
    data = json.loads(result_json)
    assert data["mode"] == "sea"
    assert "days" in data["transit_days"]


def test_freight_case_insensitive():
    result_json = freight.invoke(
        {"origin": "MUMBAI", "destination": "DUBAI", "weight_kg": 50.0, "mode": "AIR"}
    )
    data = json.loads(result_json)
    assert data["total_cost_usd"] > 0


# ── RAG tool ───────────────────────────────────────────────────────────────────

def test_rag_tool_returns_docs():
    store = MagicMock()
    store.settings.top_k_retrieval = 2
    from langchain_core.documents import Document
    store.similarity_search.return_value = [
        Document(page_content="FOB content"),
        Document(page_content="CIF content"),
    ]
    rag_tool = make_rag_tool(store)
    result = rag_tool.invoke({"query": "incoterms"})
    assert "FOB content" in result
    assert "CIF content" in result


def test_rag_tool_no_docs():
    store = MagicMock()
    store.settings.top_k_retrieval = 4
    store.similarity_search.return_value = []
    rag_tool = make_rag_tool(store)
    result = rag_tool.invoke({"query": "unknown topic"})
    assert "No relevant documents" in result
