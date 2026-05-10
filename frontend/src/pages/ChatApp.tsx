import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendMessage } from "../api";
import { ChatWindow } from "../components/ChatWindow";
import { InputBox } from "../components/InputBox";
import type { Message } from "../types";
import { useTheme } from "../context/ThemeContext";

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const addMessage = (
    sender: Message["sender"],
    text: string,
    toolUsed?: string
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender,
        text,
        toolUsed,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSend = useCallback(async (text: string) => {
    addMessage("user", text);
    setLoading(true);
    try {
      const res = await sendMessage(text);
      addMessage("assistant", res.response, res.tool_used);
    } catch {
      addMessage("assistant", "Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="app-container">
      <header className="chat-header">
        <button className="chat-back-btn" onClick={() => navigate("/")} aria-label="Back to home">
          ← Home
        </button>
        <span className="chat-header-title">LogiAgent</span>
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </header>
      <ChatWindow messages={messages} loading={loading} />
      <InputBox onSend={handleSend} disabled={loading} />
    </div>
  );
}
