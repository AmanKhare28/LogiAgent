FROM python:3.11-slim

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the embedding model at build time (avoids runtime download)
RUN python -c "\
from sentence_transformers import SentenceTransformer; \
SentenceTransformer('all-MiniLM-L6-v2'); \
print('Model downloaded.')"

COPY app/ ./app/
COPY data/ ./data/

# Pre-build the FAISS index at build time (avoids OOM at runtime)
RUN python -c "\
from app.config import get_settings; \
from app.rag.ingest import load_and_split_documents; \
from app.rag.vectorstore import FAISSVectorStore; \
settings = get_settings(); \
store = FAISSVectorStore(settings); \
docs = load_and_split_documents(settings.data_dir, settings); \
store.build(docs); \
store.save(settings.faiss_index_path); \
print('FAISS index pre-built successfully.')"

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
