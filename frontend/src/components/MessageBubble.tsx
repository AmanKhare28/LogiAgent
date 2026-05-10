import type { Message } from "../types";

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.sender === "user";

  return (
    <div className={`message-row ${isUser ? "message-row--user" : "message-row--assistant"}`}>
      <div className={`message-bubble ${isUser ? "message-bubble--user" : "message-bubble--assistant"}`}>
        <p className="message-text">{message.text}</p>
        <span className="message-time">
          {message.timestamp.toLocaleTimeString()}
        </span>
        {message.toolUsed && (
          <span className="message-tool-badge">
            {message.toolUsed === "rag" ? "⚡" : "📦"} {message.toolUsed}
          </span>
        )}
      </div>
    </div>
  );
}
