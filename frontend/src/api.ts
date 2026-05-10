import axios from "axios";
import type { ChatRequest, ChatResponse } from "./types";

// import.meta.env is Vite-only; process.env fallback is used by Jest.
const BASE_URL: string =
  import.meta.env.VITE_API_URL ||
  (typeof process !== "undefined" && process.env.VITE_API_URL) ||
  "http://localhost:8000";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

export async function sendMessage(message: string): Promise<ChatResponse> {
  const { data } = await client.post<ChatResponse>("/chat", {
    message,
  } satisfies ChatRequest);
  return data;
}
