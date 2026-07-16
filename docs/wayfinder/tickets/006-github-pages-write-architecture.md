---
labels: wayfinder:research
assignee: opencode
status: closed
---

## Question

How should a GitHub Pages-only budget website write its JSON data to a git repo?

The frontend is a static site hosted on GitHub Pages with no backend of its own. The data must live as a JSON file in the same git repo. Decide:

1. Which GitHub API to use for reading/writing the JSON file (GitHub Contents API, GraphQL, etc.).
2. How the user authenticates: personal access token pasted into the app, OAuth flow, or another method.
3. How to handle the security implications of a client-side token.
4. How to detect and handle write conflicts (e.g., the file was modified on another device between read and write).
5. The exact file path in the repo (e.g., `data/budget.json`) and branch.

Recommend a concrete write/read flow and note any tradeoffs.

## Resolution

**Date:** 2026-07-16
**Decision:** Use the **GitHub Contents API directly from the browser** with a **user-supplied personal access token**.

### Architecture

| Concern | Decision |
|---------|----------|
| API | **GitHub REST Contents API** (`/repos/{owner}/{repo}/contents/{path}`) — supports CORS and direct read/write from the browser. |
| File path | `data/budget.json` on the `main` branch. |
| Read flow | `GET /repos/{owner}/{repo}/contents/data/budget.json` → decode base64 content → parse JSON. |
| Write flow | 1. `GET` current content and `sha`  <br>2. Apply user edits in memory <br>3. Encode JSON to base64 <br>4. `PUT /repos/{owner}/{repo}/contents/data/budget.json` with `sha` and commit message. |
| Auth | **Fine-grained personal access token** (classic PAT ก็ได้ แต่ fine-grained ปลอดภัยกว่า) ที่มี permission `Contents: read and write` สำหรับ repo นี้. User เองเป็นคน paste token เข้าไปใน app แล้วเก็บใน `localStorage`. |
| Security | Token จะอยู่ฝั่ง client — มีความเสี่ยงถูกดึงออกไปถ้าใครเข้าถึง browser ได้ แต่สำหรับเครื่องตัวเองและ repo ส่วนตัว ถือว่ารับได้ ควรแนะนำให้ใช้ fine-grained token เฉพาะ repo นี้ และ rotate เป็นระยะ |
| Conflict handling | ก่อน write ต้อง `GET` เอา `sha` ล่าสุดเสมอ ถ้า GitHub ตอบ `409 Conflict` ให้ refetch แล้วให้ผู้ใช้ reload/merge ด้วยตนเอง (last-write-wins สำหรับ personal tool) |
| Rate limits | 5,000 requests/ชั่วโมง สำหรับ authenticated requests — เพียงพอสำหรับ personal use |
| Repo visibility | แนะนำ **private repo** ถ้าข้อมูลการเงินเป็นความลับ แต่ต้องใช้ GitHub Pro ถ้าต้องการ private GitHub Pages |

### Alternatives considered

- **GitHub OAuth web app flow** — ต้องมี backend เพื่อเก็บ client_secret ไม่เหมาะกับ GitHub Pages-only
- **GitHub Apps / Installation tokens** — ต้องเก็บ private key บน backend ไม่เหมาะกับฝั่ง client
- **GitHub Gist API** — ไม่ใช่ JSON file ใน repo ตาม requirement
- **Repository_dispatch / GitHub Actions** — ซับซ้อนเกินไปสำหรับ CRUD แบบ real-time

### Consequences for other tickets

- [007] Tech stack for GitHub Pages ต้องเลือก stack ที่ build เป็น static site ได้และเรียก GitHub API ด้วย `fetch` ได้
- [002] Schema ยังคงใช้ได้ ไม่มีการเปลี่ยนแปลง
- [003] UI/CRUD ยังคงใช้ได้ แต่ต้องเพิ่ม UI สำหรับ paste GitHub token และแสดงสถานะ sync

## Depends on

- None (replaces/supersedes [001 Local vs hosted: how should a JSON-in-git budget website read/write its data?](../tickets/001-deployment-model.md))
