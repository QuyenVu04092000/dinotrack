# Implementation Spec: AI Pipeline + Slack Integration

> Paste this as your FIRST prompt to Claude Code after adding CLAUDE.md to your project root.

## Prompt for Claude Code

```
Read CLAUDE.md first to understand the full project context.

Then implement the following in order. After each step, run tests and fix any errors before moving on.

### Phase 1: Install Dependencies
npm install @anthropic-ai/sdk
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npm install -D playwright @playwright/test axe-playwright
npm install -D tsx dotenv

### Phase 2: Create AI Pipeline Agents
Create these files following the architecture described in CLAUDE.md:

1. `lib/agents/spec-agent.ts`
   - Use claude-opus-4-6
   - Input: plain English string
   - Output: typed JSON spec { pages, components, userFlows, dataShapes }
   - Must validate JSON output before returning

2. `lib/agents/code-agent.ts`
   - Use claude-sonnet-4-6
   - Input: spec JSON from step 1
   - Output: writes React TypeScript component to components/GeneratedUI.tsx
   - Must strip markdown fences (```tsx) before saving
   - Must add proper TypeScript types

3. `lib/agents/review-agent.ts`
   - Self-healing loop (max 4 retries)
   - Run vitest → on failure → send code + error to claude-sonnet-4-6 → save fix → retry
   - Add 2-second delay between retries to avoid rate limiting
   - Log each attempt with attempt number

4. `lib/pipeline.ts`
   - Chain: spec-agent → code-agent → review-agent
   - Load ANTHROPIC_API_KEY from .env.local via dotenv
   - Accept CLI argument: `npx tsx lib/pipeline.ts "your idea"`
   - Log timing for each phase

5. Add to package.json scripts: `"pipeline": "tsx lib/pipeline.ts"`

### Phase 3: Testing Setup
1. Create `vitest.config.ts` — jsdom environment, include __tests__/**/*.test.tsx
2. Create `playwright.config.ts` — auto-start next dev for E2E
3. Create `tests/accessibility.spec.ts` — axe-playwright WCAG 2.1 AA checks
4. Create unit tests for each agent in `__tests__/agents/`

### Phase 4: Slack Integration (No Backend)
1. Create `lib/notify-slack.ts` — function to send Slack messages via webhook
2. Create `.github/workflows/pr-slack-review.yml`:
   - Trigger: pull_request [opened, ready_for_review]
   - Steps: checkout → get diff stats → AI summary via curl to Anthropic API (claude-haiku-4-5) → post to Slack with Block Kit message
   - Message includes: title, author, branch, file count, AI summary in Vietnamese, View Diff button
   - Footer shows: `/approve {number}` and `/reject {number}` commands
3. Create `.github/workflows/approve-from-slack.yml`:
   - Trigger: repository_dispatch [approve-pr, reject-pr]
   - Reads pr_number and slack_user from client_payload
   - Approve: POST to GitHub API → create review (APPROVE) → merge (squash)
   - Reject: POST to GitHub API → create review (REQUEST_CHANGES)
   - Notify Slack with result

### Phase 5: Validation
- Run `npx vitest run` — all tests must pass
- Run `npx tsc --noEmit` — no TypeScript errors
- Run `npx next lint` — no lint errors
- Show me a summary of all files created

Do each phase in order. Show me what you're doing at each step. Ask me if anything is unclear.
```

## After Implementation — Test Prompt

```
Run the pipeline with this test idea and show me every step:

"A settings page with a user profile form (name, email, avatar upload), a notification preferences section with toggles, and a danger zone with delete account button"

Fix any errors automatically. When done, tell me the results.
```

## Slack Workflow Builder Setup (Manual Steps)

These steps must be done manually in Slack — Claude Code cannot do them:

1. Go to Slack → Automations → New Workflow
2. Trigger: Slash command → name it `/approve`
3. Add input variable: `pr_number` (short text)
4. Add step: "Send a web request"
   - URL: https://api.github.com/repos/YOUR_ORG/YOUR_REPO/dispatches
   - Method: POST
   - Headers:
     - Authorization: Bearer YOUR_GH_PAT
     - Accept: application/vnd.github.v3+json
   - Body: {"event_type":"approve-pr","client_payload":{"pr_number":"{{pr_number}}","slack_user":"{{user}}"}}
5. Add step: "Send a message to channel"
   - Message: ⏳ Approving PR #{{pr_number}}...
6. Publish workflow
7. Repeat for `/reject` with event_type: "reject-pr"
