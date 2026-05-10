import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ChatWindow } from "../src/components/ChatWindow";
import type { Message } from "../src/types";

let msgIdCounter = 0;
const makeMsg = (sender: "user" | "assistant", text: string): Message => ({
  id: String(++msgIdCounter),
  sender,
  text,
  timestamp: new Date(),
});

test("renders without crashing with empty messages", () => {
  render(<ChatWindow messages={[]} loading={false} />);
});

test("renders the correct number of message bubbles", () => {
  const msgs = [makeMsg("user", "Hello"), makeMsg("assistant", "Hi there")];
  render(<ChatWindow messages={msgs} loading={false} />);
  expect(screen.getByText("Hello")).toBeInTheDocument();
  expect(screen.getByText("Hi there")).toBeInTheDocument();
});

test("shows typing indicator when loading=true", () => {
  render(<ChatWindow messages={[]} loading={true} />);
  expect(screen.getByTestId("typing-indicator")).toBeInTheDocument();
});

test("does not show typing indicator when loading=false", () => {
  render(<ChatWindow messages={[]} loading={false} />);
  expect(screen.queryByTestId("typing-indicator")).not.toBeInTheDocument();
});
