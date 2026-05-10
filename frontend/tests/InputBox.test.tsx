import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputBox } from "../src/components/InputBox";

test("calls onSend with trimmed text when Enter pressed", async () => {
  const onSend = jest.fn();
  render(<InputBox onSend={onSend} disabled={false} />);
  const input = screen.getByRole("textbox");
  await userEvent.type(input, "test message{enter}");
  expect(onSend).toHaveBeenCalledWith("test message");
  expect(input).toHaveValue("");
});

test("does not call onSend when input is blank/whitespace", async () => {
  const onSend = jest.fn();
  render(<InputBox onSend={onSend} disabled={false} />);
  await userEvent.type(screen.getByRole("textbox"), "   {enter}");
  expect(onSend).not.toHaveBeenCalled();
});

test("clears input after submit", async () => {
  const onSend = jest.fn();
  render(<InputBox onSend={onSend} disabled={false} />);
  const input = screen.getByRole("textbox");
  await userEvent.type(input, "hello{enter}");
  expect(input).toHaveValue("");
});

test("textarea and button are disabled when disabled=true", () => {
  render(<InputBox onSend={jest.fn()} disabled={true} />);
  expect(screen.getByRole("textbox")).toBeDisabled();
  expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();
});

test("Shift+Enter does not submit", async () => {
  const onSend = jest.fn();
  render(<InputBox onSend={onSend} disabled={false} />);
  const input = screen.getByRole("textbox");
  await userEvent.type(input, "hello");
  await userEvent.keyboard("{Shift>}{Enter}{/Shift}");
  expect(onSend).not.toHaveBeenCalled();
});
