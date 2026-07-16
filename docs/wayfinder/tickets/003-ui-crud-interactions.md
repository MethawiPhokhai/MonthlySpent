---
labels: wayfinder:grilling
assignee: opencode
status: closed
---

## Question

What UI fidelity and CRUD interactions should the budget dashboard use?

We need to decide how the user will add, edit, and delete income/expense items, and how the dashboard will look.

Key questions to resolve with the user:

- Should the dashboard **closely clone** the spreadsheet layout (colored category headers, tables, pie chart, percentage breakdown) or be a **cleaner reinterpretation**?
- How should CRUD work: **inline table editing**, **modal forms**, or a **separate edit page**?
- Where should the **scenario toggle** live (tabs, dropdown, sidebar)?
- Should the **income section** be editable as items (like expenses) or a single total field?
- Should there be a **mobile-friendly** layout, or is desktop-only acceptable?

The answer should be a set of UI decisions that can be turned into a wireframe or prototype.

## Resolution

**Date:** 2026-07-16
**Decision:** UI/CRUD direction for the budget dashboard is locked as follows.

| Topic | Decision |
|-------|----------|
| UI fidelity | **Cleaner web UI** — keep the same information structure as the spreadsheet (summary, category tables, chart) but use modern web styling, not an Excel clone. |
| CRUD pattern | **Modal form** — add/edit/delete items through a modal form; the main view is read-only except for action buttons. |
| Scenario toggle | **Tabs** at the top — two tabs: "มีรายได้" and "ไม่มีเงินเดือน". |
| Income section | **Single total field** — each scenario has one editable "Total income" number; no itemized income list. |
| Responsive | **Responsive, desktop-primary** — layout works on mobile, but the design targets desktop use first. |

### Consequences for other tickets

- [005] Dashboard prototype can now use: cleaner UI, tabs, modal forms, single income field, desktop-primary responsive layout.
- [004] Tech stack should pick a charting library that works in a responsive web UI.

## Depends on

- None
