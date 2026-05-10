import logging
from typing import Optional

from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings

from ..config import Settings

logger = logging.getLogger(__name__)


class FAISSVectorStore:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self._embedder: Embeddings = self._build_embedder(settings)
        self._store: Optional[FAISS] = None

    def _build_embedder(self, settings: Settings) -> Embeddings:
        if settings.embedding_provider == "openai":
            from langchain_openai import OpenAIEmbeddings

            return OpenAIEmbeddings(
                model=settings.embedding_model,
                api_key=settings.openai_api_key,
            )
        from langchain_huggingface import HuggingFaceEmbeddings

        return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    def build(self, docs: list[Document]) -> None:
        logger.info(f"Building FAISS index from {len(docs)} chunks...")
        self._store = FAISS.from_documents(docs, self._embedder)
        logger.info("FAISS index built.")

    def save(self, path: str) -> None:
        if not self._store:
            raise RuntimeError("Index not built")
        self._store.save_local(path)
        logger.info(f"FAISS index saved to {path}")

    def load(self, path: str) -> None:
        self._store = FAISS.load_local(
            path,
            self._embedder,
            allow_dangerous_deserialization=True,
        )
        logger.info(f"FAISS index loaded from {path}")

    def similarity_search(self, query: str, k: int = 4) -> list[Document]:
        if not self._store:
            raise RuntimeError("Index not built or loaded")
        return self._store.similarity_search(query, k=k)
