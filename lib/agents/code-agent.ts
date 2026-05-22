import Groq from "groq-sdk";
import fs from "fs";
import path from "path";
import type { UISpec } from "./spec-agent";

const OUTPUT_PATH = path.join(process.cwd(), "components", "GeneratedUI.tsx");

/**
 * Generates a React TypeScript component from a UISpec and writes it to components/GeneratedUI.tsx.
 * Uses llama-3.3-70b-versatile via Groq for fast, free inference.
 */
export async function runCodeAgent(spec: UISpec): Promise<string> {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const specJson = JSON.stringify(spec, null, 2);

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 8000,
    messages: [
      {
        role: "user",
        content: `You are a React TypeScript developer. Generate a complete React component based on this UI spec.

UI Spec:
${specJson}

Requirements:
- Use functional components with proper TypeScript types
- Use Tailwind CSS for styling
- Export a default component named GeneratedUI
- Include all pages and components from the spec as sub-components
- Make it production-quality with proper accessibility (ARIA labels, semantic HTML)
- Do NOT include any markdown fences or explanations — return ONLY the TypeScript/TSX code

The file will be saved as components/GeneratedUI.tsx`,
      },
    ],
  });

  let code = completion.choices[0]?.message?.content?.trim() ?? "";

  // Strip markdown fences if present
  code = code.replace(/^```(?:tsx?|typescript)?\n?/i, "").replace(/\n?```\s*$/i, "").trim();

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, code, "utf-8");

  return code;
}
