import { useEffect, useRef } from "react";
import type { Message } from "../types";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

interface Props {
  messages: Message[];
  loading: boolean;
}

export function ChatWindow({ messages, loading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chat-window">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
      {loading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
