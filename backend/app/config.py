from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # LLM
    llm_provider: str = "anthropic"
    model_name: str = "claude-sonnet-4-6"
    anthropic_api_key: str = ""
    openai_api_key: str = ""
    groq_api_key: str = ""
    temperature: float = 0.0
    max_tokens: int = 1024

    # Embeddings
    embedding_provider: str = "huggingface"
    embedding_model: str = "all-MiniLM-L6-v2"

    # RAG
    faiss_index_path: str = "./faiss_index"
    data_dir: str = "./data"
    chunk_size: int = 512
    chunk_overlap: int = 64
    top_k_retrieval: int = 4

    # Server
    log_level: str = "INFO"
    cors_origins: list[str] = ["http://localhost:3000"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
