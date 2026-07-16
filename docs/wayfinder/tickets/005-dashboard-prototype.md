---
labels: wayfinder:prototype
assignee: opencode
status: closed
---

## Question

Create a rough, concrete prototype of the dashboard so the user can react to the overall layout and scenario toggle before the design spec is finalized.

The prototype should include:

- A scenario toggle (normal income / unemployed).
- Income and expense tables for one scenario.
- A summary/overview section (total income, total expenses, and a placeholder for a chart).
- A simple way to add/edit/delete an item (even if just a stub interaction).

The goal is not production code; it is to validate the UI direction with the user. Use the cheapest tool that conveys the idea (e.g., plain HTML/CSS/JS, a Figma link, or a Markdown mockup).

## Resolution

**Date:** 2026-07-16
**Decision:** Close this ticket as **out of scope** for the current effort.

The UI direction was validated through [003 What UI fidelity and CRUD interactions should the budget dashboard use?](../tickets/003-ui-crud-interactions.md) via live grilling. The key decisions (cleaner web UI, tabs, modal forms, single income field, responsive desktop-primary) are already locked. A coded prototype is therefore no longer needed to make a decision, and it sits beyond the **design-spec** destination. The design spec will include textual UI/UX specifications instead.

## Depends on

- [002 What JSON schema should represent the two budget scenarios and their items?](../tickets/002-schema-design.md) — resolved
- [003 What UI fidelity and CRUD interactions should the budget dashboard use?](../tickets/003-ui-crud-interactions.md) — resolved
