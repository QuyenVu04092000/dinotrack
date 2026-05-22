import Groq from "groq-sdk";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const GENERATED_PATH = path.join(process.cwd(), "components", "GeneratedUI.tsx");
const MAX_RETRIES = 4;
const RETRY_DELAY_MS = 2000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runVitest(): { success: boolean; output: string } {
  try {
    const output = execSync("npx vitest run --reporter=verbose 2>&1", {
      cwd: process.cwd(),
      encoding: "utf-8",
      timeout: 60000,
    });
    return { success: true, output };
  } catch (err) {
    const error = err as { stdout?: string; stderr?: string; message?: string };
    const output = (error.stdout ?? "") + (error.stderr ?? "") + (error.message ?? "");
    return { success: false, output };
  }
}

/**
 * Self-healing review loop: runs vitest, and if tests fail, sends code + error to Groq
 * for a fix, saves the patch, and retries. Max 4 attempts with 2-second delays.
 */
export async function runReviewAgent(): Promise<void> {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`\n[Review Agent] Attempt ${attempt}/${MAX_RETRIES} — running vitest...`);

    const { success, output } = runVitest();

    if (success) {
      console.log("[Review Agent] All tests passed.");
      return;
    }

    console.log(`[Review Agent] Tests failed on attempt ${attempt}.`);

    if (attempt === MAX_RETRIES) {
      console.error("[Review Agent] Max retries reached. Tests still failing.");
      console.error(output);
      throw new Error("Review agent: tests failed after max retries");
    }

    const currentCode = fs.existsSync(GENERATED_PATH)
      ? fs.readFileSync(GENERATED_PATH, "utf-8")
      : "(file not found)";

    console.log("[Review Agent] Asking Groq for a fix...");

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 8000,
      messages: [
        {
          role: "user",
          content: `You are a React TypeScript debugger. The following component has test failures.

Current code (components/GeneratedUI.tsx):
\`\`\`tsx
${currentCode}
\`\`\`

Test error output:
\`\`\`
${output.slice(0, 4000)}
\`\`\`

Fix the code so all tests pass. Return ONLY the fixed TSX code with no markdown fences and no explanations.`,
        },
      ],
    });

    let fixedCode = completion.choices[0]?.message?.content?.trim() ?? "";
    fixedCode = fixedCode.replace(/^```(?:tsx?|typescript)?\n?/i, "").replace(/\n?```\s*$/i, "").trim();

    fs.writeFileSync(GENERATED_PATH, fixedCode, "utf-8");
    console.log(`[Review Agent] Patch applied. Waiting ${RETRY_DELAY_MS}ms before retry...`);
    await sleep(RETRY_DELAY_MS);
  }
}
