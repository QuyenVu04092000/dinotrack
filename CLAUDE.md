# Project Context for Claude Code

## Stack
- Next.js 14.2.5 (App Router, static export for GitHub Pages)
- TypeScript strict mode
- Tailwind CSS 3.4 with custom CSS variable tokens
- Axios 1.13 — HTTP client with JWT interceptor
- Chart.js + react-chartjs-2 + canvasjs-react-charts — charting
- next-pwa 5.6 — PWA with service workers + offline support
- Vitest 4 + @testing-library/react — unit tests
- Playwright 1.60 + axe-playwright — E2E + accessibility
- @anthropic-ai/sdk — AI pipeline agents
- groq-sdk — in-app AI chatbot

## Deployment
- `next.config.mjs`: `output: "export"` → static HTML/CSS/JS
- Base path: `/dinotrack` (GitHub Pages: `quyenvu04092000.github.io/dinotrack`)
- Images: `unoptimized: true` (no `/_next/image` endpoint in static export)
- PWA offline page at `/offline`, service worker in `public/`
- Deploy workflow: `.github/workflows/deploy.yml`

## Folder Structure

```
financial_management_fe/
├── app/                        # Next.js App Router root
│   ├── (auth)/                 # Route group: signin, signup pages
│   ├── (main)/                 # Route group: home, transactions, budgets, report, category, chat, settings
│   ├── api/                    # Next.js API routes (v1/, ai-coach/)
│   ├── components/             # Page-level UI components (EditTransactionModal, MomoBarChart, DonutChart, chat/, ai/, budgets/)
│   ├── context/                # React Context providers (AuthContext, FooterContext)
│   ├── hooks/                  # Custom React hooks, one file per feature (useHome, useTransactionsPage, useChat, …)
│   ├── lib/                    # Core utilities (apiClient.ts, jwt.ts)
│   ├── services/               # API service objects (authApi, transactionApi, categoryApi, budgetApi, chatApi)
│   ├── types/                  # TypeScript interfaces organized by feature (auth, transaction, category, budget, chat, api, …)
│   ├── utilities/              # Helper functions
│   │   ├── common/functions.ts # formatVietnameseCurrency, formatAmountInput, toVietnamISO, formatDateDDMMYYYY, …
│   │   ├── constants/
│   │   └── enums/
│   ├── layout.tsx              # Root layout
│   ├── LayoutClient.tsx        # Client wrapper: AuthProvider + FooterProvider + route guard + BottomNavBar
│   ├── globals.css
│   └── offline/                # PWA offline page
├── features/                   # Feature modules
│   ├── transactions/           # TransactionForm, TransactionList, transaction.types.ts
│   └── auth/signup/            # SignupFlow + steps (Step1–Step4)
├── shared/                     # Shared design-system components
│   └── components/             # Button.tsx, Input.tsx
├── components/                 # AI pipeline output
│   └── GeneratedUI.tsx         # AI-generated components land here
├── lib/                        # AI pipeline agents + Slack
│   ├── agents/
│   │   ├── spec-agent.ts       # claude-opus-4-6: English → JSON spec
│   │   ├── code-agent.ts       # claude-sonnet-4-6: spec → GeneratedUI.tsx
│   │   └── review-agent.ts     # Self-healing: vitest → patch → retry (max 4)
│   ├── pipeline.ts             # Entry point: chains all agents
│   └── notify-slack.ts         # Slack notification after pipeline
├── pwa/                        # PWA config
├── __tests__/                  # Unit tests (Vitest) — mirror source structure
├── tests/                      # E2E tests (Playwright)
├── .github/workflows/          # CI/CD: deploy.yml, pr-slack-review.yml, approve-from-slack.yml
└── .husky/                     # Git hooks (pre-commit)
```

## Component Rules
- All interactive components use `"use client"` directive — this project's components are all client-side
- Functional components only, never class components
- Props interface required for every component; define it above the component
- Tailwind CSS utility classes only — no inline styles, no CSS modules
- Semantic HTML + ARIA labels for accessibility
- Follow existing color tokens (`bg-background`, `text-foreground`, `text-primary`, `border-border`, etc.)

## Custom Hooks Pattern
- One hook file per feature in `app/hooks/` — e.g. `useTransactionsPage.ts`, `useChat.ts`, `useBudgets.ts`
- Hooks contain all data-fetching, state, and business logic; pages are thin wrappers that call the hook
- Return a typed object with an explicit interface (e.g. `UseTransactionsPageResult`)
- Use `useCallback` for handlers returned to components
- Data refresh pattern: increment a counter state to retrigger `useEffect`
  ```ts
  const [refreshToken, setRefreshToken] = useState(0);
  // after mutation:
  setRefreshToken((t) => t + 1);
  ```

## API Layer
- **Service objects** in `app/services/` — one file per domain, export a const object with methods
  ```ts
  export const transactionApi = {
    createTransaction: async (payload: CreateTransactionRequest): Promise<TransactionResponse> => { ... },
    updateTransaction: async (id: string, payload: UpdateTransactionRequest): Promise<TransactionResponse> => { ... },
  };
  ```
- **Axios instance** at `app/lib/apiClient.ts`:
  - Base URL: `${NEXT_PUBLIC_BASE_URL_API}/api`
  - Timeout: 15 000 ms
  - Request interceptor: reads `localStorage.getItem("accessToken")` → sets `Authorization: Bearer {token}`
- **Error handling**: always use `extractErrorMessage(error)` from `app/lib/apiClient.ts` to convert Axios errors to user-friendly strings
- **Env var**: `NEXT_PUBLIC_BASE_URL_API` — set in `.env.local`, default `http://localhost:3000`
- **Response handling**: API returns inconsistent shapes — normalize defensively:
  ```ts
  const raw: any = response.data;
  if (Array.isArray(raw)) return { data: raw };
  if (raw?.data && Array.isArray(raw.data)) return { data: raw.data };
  return { data: [] };
  ```

## State Management
- **No Redux, no Zustand** — React Context + local hook state only
- **AuthContext** (`app/context/AuthContext.tsx`): JWT tokens, user profile, login/logout, `reloadProfile()`
  - Tokens persisted in `localStorage` under keys `accessToken`, `refreshToken`, `authUser`
  - `useAuthContext()` hook — throws if used outside `AuthProvider`
- **FooterContext** (`app/context/FooterContext.tsx`): bottom navigation visibility
- Route guard lives in `LayoutClient.tsx` — redirects to `/signin` when not authenticated

## TypeScript Rules
- Strict mode enabled — no `any` types
- All exported functions must have JSDoc comments
- Types organized by feature in `app/types/{feature}.ts` (auth, transaction, category, budget, chat, api, home, …)
- Use `ApiTransactionType = "in" | "out"` literals, never magic strings elsewhere
- Keep request and response types separate (e.g. `CreateTransactionRequest` vs `TransactionResponse`)

## Naming & Code Style
- camelCase: functions, variables, hook files (`useHome.ts`)
- PascalCase: components, types, interfaces, component files (`EditTransactionModal.tsx`)
- kebab-case: utility files (`api-client.ts`), but existing files use camelCase — match surrounding files
- Prettier config: `printWidth: 120`, `tabWidth: 2`, `semi: true`, `singleQuote: false`, `trailingComma: "all"`
- ESLint: typescript-eslint strict, simple-import-sort, react-hooks rules

## Date & Currency Utilities
All helpers live in `app/utilities/common/functions.ts` — always use them, never inline:

| Function | Purpose |
|---|---|
| `formatVietnameseCurrency(amount)` | Format number as VND: `1.000.000 ₫` |
| `formatAmountInput(value)` | Format raw string with `.` separators + `đ` suffix: `1.000đ` |
| `parseAmountInput(value)` | Strip formatting → plain integer |
| `toVietnamISO(date, time?)` | Build ISO 8601 string with `+07:00` offset |
| `formatDateDDMMYYYY(date)` | Local date string: `dd/MM/yyyy` — no timezone conversion |

**Critical**: Never use `new Date(dateString).toLocaleDateString()` for display — it shifts timezone. Use `formatDateDDMMYYYY` which reads `.getDate()` / `.getMonth()` / `.getFullYear()` directly.

## Testing Rules
- Unit tests in `__tests__/` mirroring source structure — run with `npm test`
- E2E tests in `tests/` — run with `npm run test:e2e` (requires dev server)
- Accessibility: axe-playwright validates WCAG 2.2 after UI changes
- Mock external SDKs in unit tests:
  ```ts
  vi.mock("groq-sdk", () => ({
    default: class MockGroq { chat = { completions: { create: mocks.create } }; },
  }));
  ```
- Fix failing tests before moving to the next file
- Run `vitest` after every code change that touches logic

## AI Pipeline (Zero-Code Frontend Generation)

The pipeline generates frontend UI from plain English:
```
npm run pipeline "your idea here"
```

### Pipeline Stages
```
[Dev describes idea] → [Spec Agent] → [Code Agent] → [Review Agent] → [Deploy]
                         Opus 4.6       Sonnet 4.6     Sonnet + Haiku
```

### Agent Files
- `lib/agents/spec-agent.ts` — claude-opus-4-6. English → structured JSON spec (pages, components, userFlows, dataShapes). Bad spec = bad everything.
- `lib/agents/code-agent.ts` — claude-sonnet-4-6. Spec → React TypeScript component → `components/GeneratedUI.tsx`. Must strip markdown fences before saving.
- `lib/agents/review-agent.ts` — claude-sonnet-4-6 for bug reasoning, claude-haiku-4-5 for file scanning. Self-healing: runs vitest → fail → patch → retry (max 4 attempts, 2 s delay).
- `lib/pipeline.ts` — chains all agents; CLI entry point.
- `lib/notify-slack.ts` — Slack notification after pipeline completes.

### Slack Integration (Serverless)
- PR opened → GitHub Action → Claude Haiku summarizes diff in Vietnamese → Slack notification
- Manager approves via `/approve {pr_number}` slash command in Slack
- Slack Workflow Builder → GitHub `repository_dispatch` → GitHub Action approves + merges PR

#### GitHub Actions
- `.github/workflows/pr-slack-review.yml` — notify Slack on PR open with AI summary
- `.github/workflows/approve-from-slack.yml` — approve/reject PR via repository_dispatch

#### Secrets required
- `ANTHROPIC_API_KEY` — AI agents + AI diff summary
- `SLACK_BOT_TOKEN` — chat.postMessage
- `SLACK_CHANNEL_ID` — target channel
- `SLACK_WEBHOOK_URL` — result notifications
- `GH_PAT` — GitHub Personal Access Token (repo scope)

## AI Model Routing (pipeline)
- **Ambiguous / planning tasks** → claude-opus-4-6 (most capable)
- **Code generation / bug fixing** → claude-sonnet-4-6 (best balance)
- **Fast scanning / repetitive tasks** → claude-haiku-4-5 (cheap + fast)
- **Diff summarization in CI** → claude-haiku-4-5 (cost-effective)

## Git Rules
- Commit style: `feat(scope): description` / `fix(scope): description` / `refactor(scope): description`
- Never commit `.env.local` or any API keys
- Never delete features without asking first
- Never change API route signatures without approval
- PR flow: branch → PR → Slack review → approval → merge

## Workflow: Claude Code + Cursor
- Claude Code: refactor multi-file, create features, run tests, commit
- Cursor: polish UI, quick CSS edits, inline Cmd+K fixes
- Never edit the same file in both tools simultaneously
- After Claude Code finishes → review diff in Cursor
- Task > 3 files → Claude Code. Task 1–2 files → Cursor.
