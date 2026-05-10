import logging
import os
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .agent.graph import LogiAgentGraph
from .config import get_settings
from .rag.ingest import load_and_split_documents
from .rag.vectorstore import FAISSVectorStore
from .schemas import ChatRequest, ChatResponse, HealthResponse

settings = get_settings()
logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)

agent: Optional[LogiAgentGraph] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global agent
    logger.info("Building/loading FAISS index...")
    store = FAISSVectorStore(settings)

    index_file = os.path.join(settings.faiss_index_path, "index.faiss")
    if os.path.exists(index_file):
        store.load(settings.faiss_index_path)
    else:
        docs = load_and_split_documents(settings.data_dir, settings)
        store.build(docs)
        store.save(settings.faiss_index_path)

    agent = LogiAgentGraph(settings, store)
    logger.info("Agent ready.")
    yield
    logger.info("Shutting down.")


app = FastAPI(title="LogiAgent API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    try:
        result = await agent.run(req.message)
        return ChatResponse(
            response=result["final_response"],
            tool_used=result.get("tool_used"),
        )
    except Exception as e:
        logger.exception("Agent error")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse()
