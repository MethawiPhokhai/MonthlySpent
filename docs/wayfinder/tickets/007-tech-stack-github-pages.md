---
labels: wayfinder:research
assignee: opencode
status: closed
---

## Question

What tech stack supports a GitHub Pages-only deployment with client-side GitHub API writes?

Given the decision to deploy only on GitHub Pages (no backend), recommend:

- Frontend framework / build tool that produces a static site suitable for GitHub Pages.
- Styling approach.
- Charting library.
- How to call the GitHub API from the browser (native `fetch`, a small wrapper, etc.).
- How to configure GitHub Pages (branch, folder, custom domain if any).

The recommendation should avoid any server-side runtime and work entirely within the GitHub Pages constraints.

## Resolution

**Date:** 2026-07-16
**Decision:** Recommend a pure static-site stack suitable for GitHub Pages and direct GitHub API calls from the browser.

### Recommended stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Language / framework | **React 18 + TypeScript** | Same rationale as before; component model fits tabs, modals, and tables; type safety keeps schema and UI in sync. |
| Build tool | **Vite** | Fast dev server, static build output, easy GitHub Pages deployment. |
| Styling | **Tailwind CSS** | Rapid responsive styling for the cleaner web UI. |
| Charting | **Recharts** | React-first, easy donut/pie chart for the overview. |
| GitHub API client | **Native `fetch`** | No extra dependency; the GitHub Contents API is straightforward. A tiny typed wrapper inside `src/api/github.ts` is enough. |
| Routing | **None** (single-page dashboard) | The app is one view with tabs and a modal; no routing needed. If it grows later, use hash-based routing for GitHub Pages compatibility. |
| Deployment | **GitHub Pages** from `gh-pages` branch | `vite build` produces `dist/`, then push `dist/` to the `gh-pages` branch. Can automate with `gh-pages` npm package or a GitHub Actions workflow. |
| State / token | React state + `localStorage` | Store the GitHub PAT in `localStorage` after the user pastes it. |
| Form handling | React controlled components | Modal forms are simple enough; no form library needed. |

### Project layout

```
MonthlySpent/
├── .github/
│   └── workflows/
│       └── deploy.yml        # (optional) auto deploy to gh-pages on push
├── data/
│   └── budget.json           # ข้อมูลหลัก อยู่ใน git บน main
├── public/
├── src/
│   ├── api/
│   │   └── github.ts         # wrapper เรียก GitHub Contents API
│   ├── components/
│   │   ├── ScenarioTabs.tsx
│   │   ├── BudgetTable.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── ChartSection.tsx
│   │   └── ItemModal.tsx
│   ├── types/
│   │   └── budget.ts         # TypeScript types จาก schema
│   ├── hooks/
│   │   └── useBudget.ts      # load/save budget ผ่าน GitHub API
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts            # ตั้ง base: '/MonthlySpent/'
```

### Vite config for GitHub Pages

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/MonthlySpent/', // ชื่อ repo ของคุณ
})
```

### Deploy scripts (package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  }
}
```

### Alternatives considered

- **Next.js / Gatsby** — overkill for a single-page dashboard; static export is possible but adds complexity.
- **Svelte + Vite** — lighter, but smaller ecosystem.
- **Plain HTML/CSS/JS** — works but harder to maintain as the dashboard grows.
- **A dedicated GitHub API client library (e.g., Octokit)** — Octokit is great but larger than needed; native `fetch` keeps the bundle small for this use case.

### Consequences for the design spec

- The spec should include the `vite.config.ts` base path, deploy scripts, and a sample `deploy.yml` workflow.
- No backend section is needed.

## Depends on

- [006 How should a GitHub Pages-only budget website write its JSON data to a git repo?](../tickets/006-github-pages-write-architecture.md) — resolved; use GitHub Contents API from the browser
