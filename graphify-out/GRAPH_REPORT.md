# Graph Report - MonthlySpent  (2026-10-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 130 nodes · 301 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0e4eef4e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- GitHub sync & useBudget
- App shell & header
- App handlers, menu & modal
- Summary cards & formatting
- Category breakdown & totals
- Item modal & domain types
- Category detail screen
- Scenario tabs
- Budget types

## God Nodes (most connected - your core abstractions)
1. `App()` - 19 edges
2. `ExpenseItem` - 15 edges
3. `Category` - 12 edges
4. `formatCurrency()` - 9 edges
5. `BudgetData` - 8 edges
6. `useBudget()` - 8 edges
7. `GitHubConfig` - 7 edges
8. `PaymentMethod` - 7 edges
9. `CategoryDetail()` - 7 edges
10. `useTheme()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `UseBudgetActions` --references--> `ExpenseItem`  [EXTRACTED]
  src/hooks/useBudget.ts → src/types/budget.ts
- `SettingsPanelProps` --references--> `GitHubConfig`  [EXTRACTED]
  src/components/SettingsPanel.tsx → src/api/github.ts
- `UseBudgetState` --references--> `BudgetData`  [EXTRACTED]
  src/hooks/useBudget.ts → src/types/budget.ts
- `CategoryBreakdownProps` --references--> `Category`  [EXTRACTED]
  src/components/CategoryBreakdown.tsx → src/types/budget.ts
- `CategoryDetailProps` --references--> `ExpenseItem`  [EXTRACTED]
  src/components/CategoryDetail.tsx → src/types/budget.ts

## Import Cycles
- None detected.

## Communities (11 total, 2 thin omitted)

### Community 0 - "GitHub sync & useBudget"
Cohesion: 0.12
Nodes (20): base64ToUtf8(), fetchBudgetFile(), GitHubConfig, saveBudgetFile(), utf8ToBase64(), SettingsPanel(), SettingsPanelProps, generateId() (+12 more)

### Community 1 - "App shell & header"
Cohesion: 0.19
Nodes (12): HeaderMenuProps, ThemeToggle(), ThemeToggleProps, BUDGET_FILE_PATH, DEFAULT_SCENARIO_ID, LOCAL_STORAGE_CONFIG_KEY, LOCAL_STORAGE_THEME_KEY, useLocalStorage() (+4 more)

### Community 2 - "App handlers, menu & modal"
Cohesion: 0.13
Nodes (3): App(), HeaderMenu(), ItemModal()

### Community 3 - "Summary cards & formatting"
Cohesion: 0.23
Nodes (7): IncomeCard(), IncomeCardProps, SummaryCards(), SummaryCardsProps, uiFiles, classNames(), formatCurrency()

### Community 4 - "Category breakdown & totals"
Cohesion: 0.26
Nodes (9): CategoryBreakdown(), CategoryBreakdownProps, categories, expenses, categories, expenses, ExpenseItem, CategoryTotal (+1 more)

### Community 5 - "Item modal & domain types"
Cohesion: 0.31
Nodes (8): CategoryDetailProps, emptyItem, ItemModalProps, categories, item, paymentMethods, Category, PaymentMethod

### Community 6 - "Category detail screen"
Cohesion: 0.36
Nodes (6): CategoryDetail(), getPaymentMethodName(), category, expenses, paymentMethods, renderDetail()

### Community 7 - "Scenario tabs"
Cohesion: 0.53
Nodes (4): ScenarioTabs(), ScenarioTabsProps, scenarios, Scenario

### Community 9 - "Budget types"
Cohesion: 0.50
Nodes (3): BudgetMeta, Income, ScenarioId

## Knowledge Gaps
- **27 isolated node(s):** `UseBudgetResult`, `HeaderMenuProps`, `IncomeCardProps`, `SummaryCardsProps`, `CategoryTotal` (+22 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 48 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `App()` connect `App handlers, menu & modal` to `GitHub sync & useBudget`, `App shell & header`, `Summary cards & formatting`, `Category breakdown & totals`, `Category detail screen`, `Scenario tabs`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **What connects `UseBudgetResult`, `HeaderMenuProps`, `IncomeCardProps` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GitHub sync & useBudget` be split into smaller, more focused modules?**
  _Cohesion score 0.11612903225806452 - nodes in this community are weakly interconnected._
- **Why does `ExpenseItem` connect `Category breakdown & totals` to `GitHub sync & useBudget`, `App shell & header`, `Item modal & domain types`, `Category detail screen`, `Budget types`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `App handlers, menu & modal` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Why does `HeaderMenu()` connect `App handlers, menu & modal` to `App shell & header`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._