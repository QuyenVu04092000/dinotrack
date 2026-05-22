import Groq from "groq-sdk";

export interface PageSpec {
  name: string;
  route: string;
  description: string;
}

export interface ComponentSpec {
  name: string;
  props: Record<string, string>;
  description: string;
}

export interface UserFlow {
  name: string;
  steps: string[];
}

export interface DataShape {
  name: string;
  fields: Record<string, string>;
}

export interface UISpec {
  pages: PageSpec[];
  components: ComponentSpec[];
  userFlows: UserFlow[];
  dataShapes: DataShape[];
}

/**
 * Converts a plain English description into a structured JSON UI spec.
 * Uses llama-3.3-70b-versatile via Groq for fast, free inference.
 */
export async function runSpecAgent(idea: string): Promise<UISpec> {
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are a UI architect. Convert the following app idea into a structured JSON specification.

App idea: ${idea}

Return ONLY valid JSON (no markdown fences, no explanation) matching this exact shape:
{
  "pages": [{ "name": string, "route": string, "description": string }],
  "components": [{ "name": string, "props": { [key: string]: string }, "description": string }],
  "userFlows": [{ "name": string, "steps": string[] }],
  "dataShapes": [{ "name": string, "fields": { [key: string]: string } }]
}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content?.trim() ?? "";

  let spec: UISpec;
  try {
    const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```\s*$/i, "").trim();
    spec = JSON.parse(cleaned) as UISpec;
  } catch {
    throw new Error(`Spec agent returned invalid JSON: ${raw.slice(0, 200)}`);
  }

  if (!Array.isArray(spec.pages) || !Array.isArray(spec.components)) {
    throw new Error("Spec agent returned incomplete spec — missing pages or components");
  }

  return spec;
}
