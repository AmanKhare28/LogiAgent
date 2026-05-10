from unittest.mock import MagicMock

import pytest


@pytest.fixture
def mock_settings() -> MagicMock:
    s = MagicMock()
    s.llm_provider = "openai"
    s.model_name = "gpt-4o-mini"
    s.temperature = 0.0
    s.max_tokens = 512
    s.top_k_retrieval = 4
    s.embedding_provider = "huggingface"
    s.faiss_index_path = "/tmp/test_faiss"
    s.data_dir = "./data"
    s.chunk_size = 512
    s.chunk_overlap = 64
    s.cors_origins = ["*"]
    return s
