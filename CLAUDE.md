# Project Context for Claude Code

## Stack
- Next.js 14+ (App Router)
- TypeScript strict mode
- Tailwind CSS
- Vitest + @testing-library/react for unit tests
- Playwright + axe-playwright for E2E + accessibility
- @anthropic-ai/sdk for AI agents

## Architecture: AI Pipeline (Zero-Code Frontend Generation)

This project includes an AI-powered pipeline that generates frontend UI automatically.
The pipeline runs with: `npm run pipeline "your idea here"`

### Pipeline Stages

```
[Dev describes idea] → [Spec Agent] → [Code Agent] → [Review Agent] → [Deploy]
                         Opus 4.6       Sonnet 4.6     Sonnet + Haiku
```

### Agent Files
- `lib/agents/spec-agent.ts` — Uses claude-opus-4-6. Turns plain English into structured JSON spec (pages, components, userFlows, dataShapes). This is the most critical agent — bad spec = bad everything.
- `lib/agents/code-agent.ts` — Uses claude-sonnet-4-6. Generates React TypeScript components from spec. Writes to `components/GeneratedUI.tsx`. Must strip markdown fences before saving.
- `lib/agents/review-agent.ts` — Uses claude-sonnet-4-6 for bug reasoning, claude-haiku-4-5 for file scanning. Self-healing loop: runs vitest → if fail → sends error + code back to AI → patches → retries (max 4 attempts).
- `lib/pipeline.ts` — Chains all agents. Entry point. Accepts CLI arg or default idea.
- `lib/notify-slack.ts` — Sends Slack notification after pipeline completes.

### Testing Strategy (All AI-automated)
1. **Unit tests**: Vitest — AI writes + runs tests for each component
2. **Visual regression**: Playwright screenshots vs design spec
3. **E2E flow tests**: Playwright simulates real user journeys
4. **Accessibility**: axe-playwright validates WCAG 2.2 (contrast, ARIA, keyboard nav)

### Slack Integration (No Backend)
- PR opened → GitHub Action → Claude Haiku summarizes diff in Vietnamese → Slack notification
- Manager approves via `/approve {pr_number}` slash command in Slack
- Slack Workflow Builder → GitHub `repository_dispatch` → GitHub Action approves + merges PR
- No backend server needed. 100% serverless.

#### GitHub Actions:
- `.github/workflows/pr-slack-review.yml` — Notify Slack on PR open with AI summary
- `.github/workflows/approve-from-slack.yml` — Approve/reject PR via repository_dispatch

#### Secrets needed:
- `ANTHROPIC_API_KEY` — for AI agents + AI diff summary
- `SLACK_BOT_TOKEN` — for chat.postMessage
- `SLACK_CHANNEL_ID` — target channel
- `SLACK_WEBHOOK_URL` — for result notifications
- `GH_PAT` — GitHub Personal Access Token (repo scope)

## Code Conventions

### Folder Structure
```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components (PascalCase)
│   └── GeneratedUI.tsx     # AI-generated components land here
├── lib/
│   ├── agents/             # AI pipeline agents
│   └── notify-slack.ts     # Slack notification utility
├── hooks/                  # Custom React hooks (useXxx)
├── types/                  # TypeScript interfaces
├── utils/                  # Shared utility functions
└── __tests__/              # Tests mirror source structure
```

### Naming
- camelCase for functions/variables
- PascalCase for components, types, interfaces
- Files: kebab-case for utils, PascalCase for components

### TypeScript Rules
- No `any` types — always use proper interfaces
- All exported functions must have JSDoc comments
- Props interfaces for every component
- Strict mode enabled

### Component Rules
- Functional components only (no class components)
- Server components by default, `'use client'` only when needed
- Error boundaries on every page layout
- Semantic HTML + ARIA labels for accessibility
- Tailwind CSS — follow existing patterns in the project

### Testing Rules
- Tests go in `__tests__/` mirroring source structure
- Every new component or utility must have a test
- Run `vitest` after every change
- Run `playwright test` for accessibility after UI changes
- Fix failing tests before moving to next file

### Git Rules
- Commit message style: `feat(scope): description` / `fix(scope): description` / `refactor(scope): description`
- Never commit `.env.local` or API keys
- Never delete features without asking
- Never change API route signatures without approval

## AI Model Routing (for pipeline)
- **Ambiguous/planning tasks** → claude-opus-4-6 (expensive but accurate)
- **Code generation/bug fixing** → claude-sonnet-4-6 (best balance)
- **Fast scanning/repetitive tasks** → claude-haiku-4-5 (cheap + fast)
- **Diff summarization** → claude-haiku-4-5 (cost-effective for CI)

## Workflow: Claude Code + Cursor
- Claude Code: refactor multi-file, create features, run tests, commit
- Cursor: polish UI, quick CSS edits, inline Cmd+K fixes
- Rule: never edit same file in both tools simultaneously
- After Claude Code finishes → review diff in Cursor
- Task > 3 files → Claude Code. Task 1-2 files → Cursor.
