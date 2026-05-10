export type Sender = "user" | "assistant";

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  toolUsed?: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
  tool_used?: string;
}
