import { describe, it, expect, vi, beforeEach } from "vitest";
import path from "path";
import { runCodeAgent } from "../../lib/agents/code-agent";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
}));

vi.mock("groq-sdk", () => ({
  default: class MockGroq {
    chat = { completions: { create: mocks.create } };
  },
}));

vi.mock("fs", () => ({
  default: {
    mkdirSync: mocks.mkdirSync,
    writeFileSync: mocks.writeFileSync,
  },
  mkdirSync: mocks.mkdirSync,
  writeFileSync: mocks.writeFileSync,
}));

const testSpec = {
  pages: [{ name: "Dashboard", route: "/", description: "Main page" }],
  components: [{ name: "Header", props: { title: "string" }, description: "Page header" }],
  userFlows: [],
  dataShapes: [],
};

describe("code-agent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("writes generated code to components/GeneratedUI.tsx", async () => {
    const fakeCode = `export default function GeneratedUI() { return <div>Hello</div>; }`;

    mocks.create.mockResolvedValueOnce({
      choices: [{ message: { content: fakeCode } }],
    });

    const result = await runCodeAgent(testSpec);

    expect(result).toBe(fakeCode);
    expect(mocks.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining(path.join("components", "GeneratedUI.tsx")),
      fakeCode,
      "utf-8"
    );
  });

  it("strips markdown fences from generated code", async () => {
    const fakeCodeWithFences = "```tsx\nexport default function GeneratedUI() { return <div/>; }\n```";
    const expectedCode = "export default function GeneratedUI() { return <div/>; }";

    mocks.create.mockResolvedValueOnce({
      choices: [{ message: { content: fakeCodeWithFences } }],
    });

    const result = await runCodeAgent(testSpec);

    expect(result).toBe(expectedCode);
  });
});
