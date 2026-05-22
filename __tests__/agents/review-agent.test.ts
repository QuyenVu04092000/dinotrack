import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  execSync: vi.fn(),
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

vi.mock("groq-sdk", () => ({
  default: class MockGroq {
    chat = { completions: { create: mocks.create } };
  },
}));

vi.mock("child_process", () => ({
  default: { execSync: mocks.execSync },
  execSync: mocks.execSync,
}));

vi.mock("fs", () => ({
  default: {
    existsSync: mocks.existsSync,
    readFileSync: mocks.readFileSync,
    writeFileSync: mocks.writeFileSync,
    mkdirSync: vi.fn(),
  },
  existsSync: mocks.existsSync,
  readFileSync: mocks.readFileSync,
  writeFileSync: mocks.writeFileSync,
  mkdirSync: vi.fn(),
}));

describe("review-agent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.existsSync.mockReturnValue(true);
    mocks.readFileSync.mockReturnValue("// existing code");
  });

  it("succeeds immediately when vitest passes on the first attempt", async () => {
    mocks.execSync.mockReturnValueOnce("All tests passed");

    const { runReviewAgent } = await import("../../lib/agents/review-agent");
    await expect(runReviewAgent()).resolves.toBeUndefined();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("retries after a failed vitest run and succeeds on second attempt", async () => {
    const failError = Object.assign(new Error("test fail"), {
      stdout: "FAIL src/test.tsx",
      stderr: "Error: expect received",
    });

    mocks.execSync
      .mockImplementationOnce(() => { throw failError; })
      .mockReturnValueOnce("All tests passed");

    mocks.create.mockResolvedValueOnce({
      choices: [{ message: { content: "export default function Fixed() { return <div/>; }" } }],
    });

    const { runReviewAgent } = await import("../../lib/agents/review-agent");
    await expect(runReviewAgent()).resolves.toBeUndefined();
    expect(mocks.create).toHaveBeenCalledTimes(1);
  }, 10000);

  it("throws after exhausting all retries", async () => {
    const failError = Object.assign(new Error("test fail"), {
      stdout: "FAIL",
      stderr: "Error",
    });

    mocks.execSync.mockImplementation(() => { throw failError; });
    mocks.create.mockResolvedValue({
      choices: [{ message: { content: "export default function Fixed() { return <div/>; }" } }],
    });

    const { runReviewAgent } = await import("../../lib/agents/review-agent");
    await expect(runReviewAgent()).rejects.toThrow("max retries");
  }, 30000);
});
