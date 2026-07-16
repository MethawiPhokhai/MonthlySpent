---
labels: wayfinder:research
assignee: opencode
status: closed
---

## Question

What tech stack should the budget website use?

Recommend a concrete stack for the chosen deployment model, covering:

- Frontend framework / language (e.g., React, Vue, Svelte, vanilla JS).
- Styling approach (CSS framework, Tailwind, inline styles, etc.).
- Charting library for the overview pie/donut chart.
- Build / hosting setup (Vite, Next.js, GitHub Pages, etc.).
- If a backend is needed (local server or GitHub API proxy), what runtime and libraries to use.

The recommendation should be justified by the deployment model from the earlier decision and the UI/CRUD decisions. Keep it simple for a single-person, file-backed budget website.

## Resolution

**Date:** 2026-07-16
**Decision:** Recommend the following stack for the local-first budget website.

### Recommended stack (superseded)

**Note (2026-07-16):** This stack assumes a local Express backend. The user later clarified **GitHub Pages only**, so this recommendation is superseded by [007 What tech stack supports a GitHub Pages-only deployment with client-side GitHub API writes?](../tickets/007-tech-stack-github-pages.md).

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend framework | **React 18 + TypeScript** | Component model fits tabs, modals, and tables; type safety helps keep schema and UI in sync; large ecosystem. |
| Build tool | **Vite** | Fast dev server, simple config, good TypeScript/React support, easy static build. |
| Styling | **Tailwind CSS** | Rapid responsive styling, desktop-primary layout, consistent spacing/typography for a cleaner web UI. |
| Charting | **Recharts** | React-first, easy donut/pie chart, enough for the overview chart in the image. |
| Backend / runtime | **Node.js + Express** | Lightweight local server that can read/write the JSON file directly and serve the built static files. |
| Storage | **JSON file on filesystem** (`data/budget.json`) | Matches the requirement to keep data in git; trivial to read/write and diff. |
| Dev runner | **`concurrently`** (Vite dev + Express) | Simple local dev setup; both frontend and backend hot-reload. |
| Form / state | React state + `fetch` | Modal forms are simple enough; no need for heavy form or state libraries. |

### Project layout

```
MonthlySpent/
├── data/
│   └── budget.json          # ข้อมูลหลัก อยู่ใน git
├── server/
│   └── index.ts             # Express API + static file server
├── src/
│   ├── components/          # UI components (tabs, modal, table, chart)
│   ├── types/               # TypeScript types จาก schema
│   └── App.tsx
├── package.json
└── vite.config.ts
```

### API ที่ backend ควรมี

- `GET /api/budget` — อ่าน `data/budget.json`
- `POST /api/budget` — เขียน `data/budget.json` ทั้งไฟล์

(frontend แก้ไข state แล้วส่งทั้ง object กลับไป save)

### Alternatives considered

- **Next.js**: powerful but overkill for a single-person local tool; filesystem writes in dev mode are more awkward.
- **Svelte + SvelteKit**: simpler in some ways, but smaller ecosystem and less familiar to many maintainers.
- **Chart.js**: solid, but Recharts integrates more naturally with React.
- **Python/Flask backend**: works, but keeping frontend and backend in one language (TypeScript) reduces context switching.

### Consequences for other tickets

- [005] Dashboard prototype can be built with React + Tailwind + Recharts.
- The design spec should include a sample `package.json`, dev scripts, and the API contract.

## Depends on

- [001 Local vs hosted: how should a JSON-in-git budget website read/write its data?](../tickets/001-deployment-model.md) — resolved; local-first server
