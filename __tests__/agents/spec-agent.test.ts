import { describe, it, expect, vi, beforeEach } from "vitest";
import { runSpecAgent } from "../../lib/agents/spec-agent";

const mocks = vi.hoisted(() => ({ create: vi.fn() }));

vi.mock("groq-sdk", () => ({
  default: class MockGroq {
    chat = { completions: { create: mocks.create } };
  },
}));

describe("spec-agent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a valid UISpec from a plain English description", async () => {
    const fakeSpec = {
      pages: [{ name: "Dashboard", route: "/dashboard", description: "Main view" }],
      components: [{ name: "BalanceCard", props: { amount: "number" }, description: "Shows balance" }],
      userFlows: [{ name: "View balance", steps: ["Open app", "See dashboard"] }],
      dataShapes: [{ name: "Transaction", fields: { id: "string", amount: "number" } }],
    };

    mocks.create.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(fakeSpec) } }],
    });

    const result = await runSpecAgent("A finance dashboard");

    expect(result.pages).toHaveLength(1);
    expect(result.pages[0].name).toBe("Dashboard");
    expect(result.components).toHaveLength(1);
    expect(result.userFlows).toHaveLength(1);
    expect(result.dataShapes).toHaveLength(1);
  });

  it("throws when the LLM returns invalid JSON", async () => {
    mocks.create.mockResolvedValueOnce({
      choices: [{ message: { content: "not valid json at all" } }],
    });

    await expect(runSpecAgent("bad idea")).rejects.toThrow("invalid JSON");
  });

  it("throws when spec is missing required arrays", async () => {
    mocks.create.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify({ pages: [] }) } }],
    });

    await expect(runSpecAgent("incomplete")).rejects.toThrow("missing pages or components");
  });
});
