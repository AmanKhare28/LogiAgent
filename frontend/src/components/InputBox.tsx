import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function InputBox({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="input-box">
      <textarea
        className="input-textarea"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask about supply chain, freight costs, Incoterms…"
        rows={1}
      />
      <button
        className="input-send-btn"
        onClick={submit}
        disabled={disabled}
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  );
}
