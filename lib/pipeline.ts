import "dotenv/config";
import { runSpecAgent } from "./agents/spec-agent";
import { runCodeAgent } from "./agents/code-agent";
import { runReviewAgent } from "./agents/review-agent";
import { notifySlack } from "./notify-slack";

async function run(): Promise<void> {
  const idea = process.argv[2] ?? "A personal finance dashboard with income/expense tracking and monthly summaries";

  console.log("\n=== AI Pipeline Starting ===");
  console.log(`Idea: "${idea}"\n`);

  // Phase 1: Spec
  const specStart = Date.now();
  console.log("[Pipeline] Phase 1: Spec Agent (claude-opus-4-6)...");
  const spec = await runSpecAgent(idea);
  console.log(`[Pipeline] Spec generated in ${Date.now() - specStart}ms`);
  console.log(`[Pipeline] Pages: ${spec.pages.map((p) => p.name).join(", ")}`);

  // Phase 2: Code
  const codeStart = Date.now();
  console.log("\n[Pipeline] Phase 2: Code Agent (claude-sonnet-4-6)...");
  await runCodeAgent(spec);
  console.log(`[Pipeline] Code generated in ${Date.now() - codeStart}ms`);

  // Phase 3: Review
  const reviewStart = Date.now();
  console.log("\n[Pipeline] Phase 3: Review Agent (self-healing)...");
  await runReviewAgent();
  console.log(`[Pipeline] Review completed in ${Date.now() - reviewStart}ms`);

  console.log("\n=== Pipeline Complete ===");

  await notifySlack({
    text: `Pipeline completed for: "${idea}"`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Pipeline Complete* :white_check_mark:\n*Idea:* ${idea}\n*Pages generated:* ${spec.pages.map((p) => p.name).join(", ")}`,
        },
      },
    ],
  });
}

run().catch((err) => {
  console.error("[Pipeline] Fatal error:", err);
  process.exit(1);
});
