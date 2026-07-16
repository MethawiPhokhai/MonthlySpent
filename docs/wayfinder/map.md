# Wayfinder Map: Budget Website Design

## Destination

A design specification for a personal budget website **deployed on GitHub Pages only** that supports two separate scenarios (normal income vs unemployed), allows CRUD of income/expense items via a web UI, stores data as a JSON file in git, and displays an overview dashboard similar to the provided spreadsheet image.

## Notes

- **Domain**: personal budget tracking in Thai Baht (THB), two scenarios (normal income / unemployed).
- **Skills**: `grilling`, `wayfinder`.
- **Standing preferences from user**:
  - Deliverable is a **design spec**, not a working prototype or full implementation.
  - Two scenarios are **separate budget views** that can be toggled.
  - Data is stored as a **JSON file in git**; CRUD happens through the web UI.
  - **Deployment is GitHub Pages only** — no backend/server of its own; the site must write to the JSON file via the GitHub API from the browser.
  - The spec should **compare tradeoffs** and recommend:
    - JSON schema for items, categories, income, and scenarios.
    - GitHub Pages write architecture (auth, conflict handling, file path).
- **Communication language**: Thai.
- **Deliverable**: Design spec written at [`docs/design-spec.md`](design-spec.md).
- **Tracker convention** (local-markdown): This repo has no external issue tracker, so the map and tickets live as markdown files under `docs/wayfinder/`. Open tickets are files in `docs/wayfinder/tickets/`. Blocking is expressed in each ticket's `## Depends on` section. The frontier is open tickets with no open blockers and no assignee.

## Decisions so far

- [002 What JSON schema should represent the two budget scenarios and their items?](tickets/002-schema-design.md) — Use a **scenario-centric** schema with global `categories` and `paymentMethods`; keep `due` as a free-text string; compute totals in the UI.
- [003 What UI fidelity and CRUD interactions should the budget dashboard use?](tickets/003-ui-crud-interactions.md) — **Cleaner web UI** with **tabs** for scenarios, **modal forms** for CRUD, **single total income field**, and **responsive desktop-primary** layout.
- [006 How should a GitHub Pages-only budget website write its JSON data to a git repo?](tickets/006-github-pages-write-architecture.md) — Use the **GitHub Contents API from the browser** with a **user-supplied fine-grained PAT**, store data at `data/budget.json`, handle conflicts with refetch/alert.
- [007 What tech stack supports a GitHub Pages-only deployment with client-side GitHub API writes?](tickets/007-tech-stack-github-pages.md) — **React 18 + TypeScript + Vite + Tailwind CSS + Recharts**, static build deployed to **GitHub Pages `gh-pages` branch**, GitHub API via native `fetch`.

### Superseded decisions

- ~~[001 Local vs hosted: how should a JSON-in-git budget website read/write its data?](tickets/001-deployment-model.md)~~ — Was local-first server; superseded by [006 GitHub Pages write architecture](tickets/006-github-pages-write-architecture.md).
- ~~[004 What tech stack should the budget website use?](tickets/004-tech-stack.md)~~ — Was local Express backend; superseded by [007 Tech stack for GitHub Pages](tickets/007-tech-stack-github-pages.md).

## Not yet specified

- None — all known fog is now ticketed or ruled out of scope.

## Out of scope

- Full implementation of the website (destination is design spec only).
- Multi-user support beyond a single personal budget.
- Mobile app / native app.
- Full transcription of the provided image into a seed JSON file (not required for the design spec; can be created during implementation or prototyping if needed).
- [005 Rough dashboard layout and scenario toggle](tickets/005-dashboard-prototype.md) — no longer needed because UI direction was locked in ticket 003; coded prototype is beyond the design-spec destination.
