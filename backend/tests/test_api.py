import pytest
from httpx import ASGITransport, AsyncClient
from unittest.mock import AsyncMock, patch

from app.main import app


@pytest.mark.asyncio
async def test_chat_happy_path():
    mock_result = {"final_response": "Test answer", "tool_used": "rag"}
    with patch("app.main.agent") as m:
        m.run = AsyncMock(return_value=mock_result)
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            resp = await ac.post("/chat", json={"message": "What is FOB?"})
    assert resp.status_code == 200
    assert "response" in resp.json()


@pytest.mark.asyncio
async def test_chat_missing_message():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.post("/chat", json={})
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_chat_blank_message():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.post("/chat", json={"message": "   "})
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_chat_message_too_long():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.post("/chat", json={"message": "a" * 2001})
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_chat_agent_error():
    with patch("app.main.agent") as m:
        m.run = AsyncMock(side_effect=Exception("LLM failure"))
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            resp = await ac.post("/chat", json={"message": "What is FOB?"})
    assert resp.status_code == 500


@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"
