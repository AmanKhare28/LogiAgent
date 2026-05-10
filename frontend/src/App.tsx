import { useCallback, useState } from "react";
import { sendMessage } from "./api";
import { ChatWindow } from "./components/ChatWindow";
import { InputBox } from "./components/InputBox";
import type { Message } from "./types";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

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
      <ChatWindow messages={messages} loading={loading} />
      <InputBox onSend={handleSend} disabled={loading} />
    </div>
  );
}
