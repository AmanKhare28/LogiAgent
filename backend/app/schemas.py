from typing import Optional

from pydantic import BaseModel, Field, field_validator


class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="Natural-language query from the user",
    )

    @field_validator("message")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("message cannot be blank")
        return stripped


class ChatResponse(BaseModel):
    response: str = Field(..., description="LLM-synthesised answer")
    tool_used: Optional[str] = Field(None, description="rag | freight | None")


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
