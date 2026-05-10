// jest.mock is hoisted before all imports — factory runs before api.ts loads
jest.mock("axios", () => ({
  create: jest.fn().mockReturnValue({
    post: jest.fn(),
  }),
}));

import axios from "axios";
import { sendMessage } from "../src/api";

// Capture the mock client that api.ts received when it called axios.create()
const mockClient = (axios.create as jest.Mock).mock.results[0].value as {
  post: jest.Mock;
};

describe("sendMessage", () => {
  beforeEach(() => {
    mockClient.post.mockClear();
  });

  test("resolves with response and tool_used on 200", async () => {
    const mockData = { response: "FOB means Free On Board", tool_used: "rag" };
    mockClient.post.mockResolvedValueOnce({ data: mockData });

    const result = await sendMessage("What is FOB?");

    expect(mockClient.post).toHaveBeenCalledWith("/chat", { message: "What is FOB?" });
    expect(result).toEqual(mockData);
  });

  test("rejects on network error", async () => {
    mockClient.post.mockRejectedValueOnce(new Error("Network Error"));

    await expect(sendMessage("test")).rejects.toThrow("Network Error");
  });

  test("rejects on 500 response", async () => {
    const serverError = {
      response: { status: 500, data: { detail: "Internal server error" } },
    };
    mockClient.post.mockRejectedValueOnce(serverError);

    await expect(sendMessage("test")).rejects.toEqual(serverError);
  });
});
