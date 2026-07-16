---
labels: wayfinder:research
assignee: opencode
status: closed
---

## Question

What deployment model should the budget website use so that it can store data as a JSON file in git while allowing CRUD via a web UI?

Compare at least these options:

1. **Local server** — a small backend/server running on the user's machine that reads/writes the JSON file directly in the git repo folder. No auth needed; the user commits via git CLI.
2. **Hosted static site + GitHub API** — the frontend is hosted (e.g., GitHub Pages), and writes go back to the repo via the GitHub API. Requires GitHub OAuth and a backend or serverless function.
3. **Hybrid / local-first** — e.g., a desktop app (Electron/Tauri) or local PWA that writes to the filesystem, then the user commits normally.

Recommend a default option and document the tradeoffs for each: setup complexity, auth, git workflow, offline use, and long-term maintainability.

## Resolution

**Date:** 2026-07-16
**Decision:** Recommend a **local-first server** as the default deployment model.

### Comparison

1. **Local server (recommended)**
   - A small dev server (e.g., Vite dev server + a tiny backend route, or a lightweight Node/Express app) runs on the user's machine.
   - The server reads/writes the JSON budget file directly in the repo folder.
   - The user commits changes with normal git commands.
   - **Pros:** no auth, no API rate limits, no CORS, offline capable, git workflow stays natural, simplest to build and maintain.
   - **Cons:** only works on the local machine; must run the server; not accessible from other devices.

2. **Hosted static site + GitHub API**
   - The frontend is hosted (e.g., GitHub Pages / Vercel). Writes go back to the repo via the GitHub API using a personal access token or OAuth.
   - **Pros:** accessible from anywhere, no local server needed.
   - **Cons:** requires GitHub auth/token, CORS concerns, API rate limits, more complex setup, harder to handle conflicts, and risks of writing to the repo from a public site.

3. **Hybrid / local-first desktop app (Electron/Tauri)**
   - A desktop app that writes the JSON file directly and the user commits via git.
   - **Pros:** native file access, can be installed like an app.
   - **Cons:** more build/distribution complexity than a local web server; overkill for a single-person tool.

### Recommendation (superseded)

**Note (2026-07-16):** This decision was made when the target deployment was open. The user later clarified **GitHub Pages only**, so this recommendation is superseded by [006 How should a GitHub Pages-only budget website write its JSON data to a git repo?](../tickets/006-github-pages-write-architecture.md).

Use a **local server** as the default for this design spec. It is the smallest, most reliable model for a single-person, file-backed budget website and fits the requirement that the JSON file lives in git.

Document the hosted GitHub-API option as a **future extension** with a clear note that it requires auth and conflict-handling design, but do not build the spec around it.

### Consequences for other tickets

- Auth and git conflict handling are handled by the user's normal git workflow in the default model.
- Tech stack choice can now assume a local server with filesystem access.

## Depends on

- None
