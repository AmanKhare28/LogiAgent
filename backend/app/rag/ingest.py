import logging
import os

from langchain_community.document_loaders import CSVLoader, TextLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from ..config import Settings

logger = logging.getLogger(__name__)

LOADERS = {
    ".txt": TextLoader,
    ".md": TextLoader,
    ".csv": CSVLoader,
}


def load_and_split_documents(data_dir: str, settings: Settings) -> list[Document]:
    all_docs: list[Document] = []

    for fname in os.listdir(data_dir):
        ext = os.path.splitext(fname)[1].lower()
        loader_cls = LOADERS.get(ext)

        if not loader_cls:
            logger.warning(f"Skipping unsupported file: {fname}")
            continue

        path = os.path.join(data_dir, fname)
        docs = loader_cls(path).load()
        all_docs.extend(docs)

    logger.info(f"Loaded {len(all_docs)} raw documents from {data_dir}")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ".", " ", ""],
    )

    chunks = splitter.split_documents(all_docs)
    logger.info(f"Split into {len(chunks)} chunks")

    return chunks
