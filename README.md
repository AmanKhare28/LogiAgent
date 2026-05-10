# LogiAgent

> AI-powered supply chain assistant — ask freight costs, Incoterms, and logistics questions in natural language.

![Python](https://img.shields.io/badge/Python-3.11-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green) ![LangGraph](https://img.shields.io/badge/LangGraph-0.2-purple) ![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ed)

## Live Demo

| Route | Description |
|---|---|
| `/` | Landing page — animated, dark/light mode, SK-Modernist font |
| `/chat` | Full chat interface connected to the FastAPI agent |

---

## Architecture

LogiAgent is a three-tier system: a React/TypeScript SPA (with a landing page + chat interface), a FastAPI backend orchestrating a LangGraph agent, and a FAISS vector store for retrieval-augmented generation.

```
┌────────────────────────────────────────────────────────────────┐
│                      LOGIAAGENT SYSTEM                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  React + TypeScript (Vite)  ◄────── User / Browser            │
│  ┌───────────────────────────────────┐                         │
│  │ LandingPage  /                    │                         │
│  │   Navbar · Hero · Stats           │                         │
│  │   Features · HowItWorks           │                         │
│  │   DemoTeaser · Footer             │                         │
│  │                                   │                         │
│  │ ChatApp  /chat                    │                         │
│  │   ChatWindow · InputBox           │                         │
│  │   MessageBubble · TypingIndicator │                         │
│  └──────────────┬────────────────────┘                         │
│                 │ POST /chat (JSON)                            │
│                 ▼                                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ FastAPI Backend                                          │  │
│  │  ┌───────────────────────────────────────────────────┐  │  │
│  │  │ LangGraph StateGraph                              │  │  │
│  │  │                                                   │  │  │
│  │  │  [router_node] ──► rag_tool (FAISS lookup)        │  │  │
│  │  │        │                                          │  │  │
│  │  │        └──────► freight_tool (Haversine calc)     │  │  │
│  │  └───────────────────────────────────────────────────┘  │  │
│  │  Groq llama-3.3-70b-versatile  (free tier)              │  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─────────────────────┐  ┌──────────────────────────────┐    │
│  │ FAISS Vector Store  │  │ Supply Chain KB (logistics_  │    │
│  │ (all-MiniLM-L6-v2)  │  │ kb.txt — Incoterms, freight) │    │
│  └─────────────────────┘  └──────────────────────────────┘    │
└────────────────────────────────────────────────────────────────┘
```

---

## Features

- **Professional landing page** — animated hero, stats bar, feature cards, how-it-works timeline, demo teaser, dark/light mode toggle with no flash
- **Natural-language chat** — ask any supply chain or logistics question
- **RAG retrieval** — searches a FAISS-indexed knowledge base covering Incoterms, freight modes, and trade docs
- **Freight cost calculator** — estimates air/sea/road/rail costs between 16 major global hubs using the Haversine formula
- **Free to run** — Groq free-tier LLM (`llama-3.3-70b-versatile`) + HuggingFace local embeddings (`all-MiniLM-L6-v2`). Zero API cost.
- **Single-command startup** — `docker compose up --build`

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + TypeScript | Landing page + chat UI |
| Routing | React Router v6 | `/` landing, `/chat` app, `*` 404 |
| Animations | Framer Motion | Scroll-triggered, staggered, spring |
| Build tool | Vite 5 | Fast dev server, production bundler |
| HTTP client | Axios | API calls with timeout/error handling |
| Frontend tests | Jest + React Testing Library | Component + API unit tests |
| Backend | FastAPI (Python 3.11) | REST API, validation, CORS |
| AI orchestration | LangGraph 0.2 | Explicit agent graph with conditional routing |
| LLM | Groq `llama-3.3-70b-versatile` | Free-tier LLM, sub-second latency |
| LLM SDK | LangChain + langchain-groq | Provider abstraction |
| Vector store | FAISS (CPU) | In-process similarity search |
| Embeddings | HuggingFace `all-MiniLM-L6-v2` | Free, local, no API key |
| Backend tests | Pytest + pytest-asyncio | Async API, agent, and RAG tests |
| Containerisation | Docker + Compose | One-command full stack |

---

## Quick Start (Free — No API key required for Groq free tier)

1. Clone:
   ```bash
   git clone https://github.com/<your-username>/logiaagent.git
   cd logiaagent
   ```

2. Set up your `.env`:
   ```bash
   cp backend/.env.example backend/.env
   # Add your free Groq API key from https://console.groq.com
   ```

3. Start the full stack:
   ```bash
   docker compose up --build
   ```

4. Open `http://localhost:3000` — landing page loads, click **Open Chat** to chat.

---

## Development (without Docker)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # add GROQ_API_KEY
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```

---

## Running Tests

### Backend (29 tests)

```bash
cd backend
pytest tests/ -v --tb=short
```

### Frontend (12 tests)

```bash
cd frontend
npm test -- --watchAll=false
```

---

## Project Structure

```
logiaagent/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app, lifespan, endpoints
│   │   ├── schemas.py        # Pydantic request/response models
│   │   ├── config.py         # Settings via pydantic-settings
│   │   ├── agent/
│   │   │   ├── graph.py      # LangGraph StateGraph
│   │   │   ├── tools.py      # RAG + Freight calculator tools
│   │   │   └── prompts.py    # System prompt
│   │   └── rag/
│   │       ├── vectorstore.py
│   │       └── ingest.py
│   ├── data/
│   │   └── logistics_kb.txt  # Knowledge base
│   ├── tests/
│   │   ├── test_api.py
│   │   ├── test_agent.py
│   │   └── test_rag.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── ThemeContext.tsx   # Dark/light mode with localStorage
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── ChatApp.tsx
│   │   │   └── NotFound.tsx
│   │   ├── components/
│   │   │   ├── landing/
│   │   │   │   ├── Navbar.tsx     # Glass nav, theme toggle, scroll effect
│   │   │   │   ├── Hero.tsx       # Staggered headline + floating SVG mockup
│   │   │   │   ├── Stats.tsx      # CountUp animation on scroll
│   │   │   │   ├── Features.tsx   # Alternating slide-in cards
│   │   │   │   ├── HowItWorks.tsx # Spring-animated timeline
│   │   │   │   ├── DemoTeaser.tsx # Blurred chat preview + CTA
│   │   │   │   └── Footer.tsx     # Dark footer with tech-stack pills
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── InputBox.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── main.tsx              # BrowserRouter + ThemeProvider + Routes
│   │   └── index.css             # CSS custom properties, dark/light tokens
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## API Reference

### POST /chat

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is FOB Incoterm?"}'
```

**Response:**
```json
{
  "response": "FOB (Free on Board) means the seller delivers goods to the named port...",
  "tool_used": "rag"
}
```

### GET /health

```bash
curl http://localhost:8000/health
# {"status":"ok","version":"1.0.0"}
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `LLM_PROVIDER` | `groq` | `groq`, `anthropic`, or `openai` |
| `MODEL_NAME` | `llama-3.3-70b-versatile` | LLM model identifier |
| `GROQ_API_KEY` | — | Free key from console.groq.com |
| `ANTHROPIC_API_KEY` | — | Optional — if `LLM_PROVIDER=anthropic` |
| `OPENAI_API_KEY` | — | Optional — if `LLM_PROVIDER=openai` |
| `EMBEDDING_PROVIDER` | `huggingface` | `huggingface` (free) or `openai` |
| `FAISS_INDEX_PATH` | `./faiss_index` | Persisted index path |
| `DATA_DIR` | `./data` | Knowledge base directory |
| `CHUNK_SIZE` | `512` | RAG chunk size |
| `CHUNK_OVERLAP` | `64` | Chunk overlap |
| `TOP_K_RETRIEVAL` | `4` | Chunks returned per query |
| `CORS_ORIGINS` | `["http://localhost:3000"]` | Allowed origins |

---

*Built by Aman (Froggy) — portfolio project demonstrating FastAPI, LangGraph, FAISS, RAG, Groq, React, TypeScript, Framer Motion, and Docker in one cohesive stack.*
