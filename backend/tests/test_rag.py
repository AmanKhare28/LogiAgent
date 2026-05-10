import os
import tempfile
import pytest
from unittest.mock import MagicMock, patch

from langchain_core.documents import Document

from app.rag.vectorstore import FAISSVectorStore
from app.rag.ingest import load_and_split_documents


@pytest.fixture
def mock_settings() -> MagicMock:
    s = MagicMock()
    s.embedding_provider = "openai"
    s.embedding_model = "text-embedding-3-small"
    s.openai_api_key = "test-key"
    s.chunk_size = 200
    s.chunk_overlap = 20
    return s


@pytest.fixture
def hf_settings() -> MagicMock:
    s = MagicMock()
    s.embedding_provider = "huggingface"
    s.embedding_model = "all-MiniLM-L6-v2"
    s.chunk_size = 200
    s.chunk_overlap = 20
    return s


# ── VectorStore tests ──────────────────────────────────────────────────────────

def test_similarity_search_returns_k_docs(mock_settings: MagicMock):
    store = FAISSVectorStore.__new__(FAISSVectorStore)
    store.settings = mock_settings
    fake_docs = [Document(page_content=f"doc {i}") for i in range(4)]
    store._store = MagicMock()
    store._store.similarity_search.return_value = fake_docs

    results = store.similarity_search("shipping terms", k=4)

    assert len(results) == 4
    store._store.similarity_search.assert_called_once_with("shipping terms", k=4)


def test_similarity_search_raises_if_not_built(mock_settings: MagicMock):
    store = FAISSVectorStore.__new__(FAISSVectorStore)
    store._store = None

    with pytest.raises(RuntimeError, match="not built"):
        store.similarity_search("query")


def test_build_creates_store(mock_settings: MagicMock):
    store = FAISSVectorStore.__new__(FAISSVectorStore)
    store.settings = mock_settings
    store._store = None

    fake_embedder = MagicMock()
    store._embedder = fake_embedder

    docs = [Document(page_content="test content")]
    fake_faiss = MagicMock()

    with patch("app.rag.vectorstore.FAISS.from_documents", return_value=fake_faiss) as mock_fd:
        store.build(docs)

    assert store._store is fake_faiss
    mock_fd.assert_called_once_with(docs, fake_embedder)


def test_save_raises_if_not_built():
    store = FAISSVectorStore.__new__(FAISSVectorStore)
    store._store = None

    with pytest.raises(RuntimeError, match="not built"):
        store.save("/tmp/idx")


def test_save_calls_save_local():
    store = FAISSVectorStore.__new__(FAISSVectorStore)
    store._store = MagicMock()

    store.save("/tmp/idx")

    store._store.save_local.assert_called_once_with("/tmp/idx")


def test_load_calls_load_local(mock_settings: MagicMock):
    store = FAISSVectorStore.__new__(FAISSVectorStore)
    store.settings = mock_settings
    fake_embedder = MagicMock()
    store._embedder = fake_embedder
    store._store = None

    fake_faiss = MagicMock()
    with patch("app.rag.vectorstore.FAISS.load_local", return_value=fake_faiss) as mock_ll:
        store.load("/tmp/idx")

    assert store._store is fake_faiss
    mock_ll.assert_called_once_with("/tmp/idx", fake_embedder, allow_dangerous_deserialization=True)


def test_build_embedder_openai(mock_settings: MagicMock):
    store = FAISSVectorStore.__new__(FAISSVectorStore)
    with patch("langchain_openai.OpenAIEmbeddings") as mock_oai:
        store._build_embedder(mock_settings)
    mock_oai.assert_called_once()


def test_build_embedder_huggingface(hf_settings: MagicMock):
    store = FAISSVectorStore.__new__(FAISSVectorStore)
    with patch("langchain_huggingface.HuggingFaceEmbeddings") as mock_hf:
        store._build_embedder(hf_settings)
    mock_hf.assert_called_once_with(model_name="all-MiniLM-L6-v2")


def test_vectorstore_init_with_openai(mock_settings: MagicMock):
    with patch("langchain_openai.OpenAIEmbeddings"):
        store = FAISSVectorStore(mock_settings)
    assert store.settings is mock_settings
    assert store._store is None


# ── Ingest tests ───────────────────────────────────────────────────────────────

def test_load_and_split_txt_file(mock_settings: MagicMock):
    with tempfile.TemporaryDirectory() as tmpdir:
        txt_path = os.path.join(tmpdir, "test.txt")
        with open(txt_path, "w") as f:
            f.write("FOB means Free On Board.\n\nCIF means Cost Insurance Freight.")

        chunks = load_and_split_documents(tmpdir, mock_settings)

    assert len(chunks) >= 1
    assert all(hasattr(c, "page_content") for c in chunks)


def test_load_and_split_skips_unsupported(mock_settings: MagicMock):
    with tempfile.TemporaryDirectory() as tmpdir:
        jpg_path = os.path.join(tmpdir, "image.jpg")
        with open(jpg_path, "wb") as f:
            f.write(b"\xff\xd8\xff")

        chunks = load_and_split_documents(tmpdir, mock_settings)

    assert chunks == []
