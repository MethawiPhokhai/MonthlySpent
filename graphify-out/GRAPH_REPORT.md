# Graph Report - MonthlySpent  (2026-10-01)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 123 nodes · 283 edges · 10 communities (8 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `900eecad`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App shell (App, Collapsible, ItemModal, ThemeToggle)
- Expense table & category groups
- useBudget state machine
- Donut chart
- Summary cards & formatting
- GitHub Contents API client
- Scenario tabs & domain types
- GitHub settings panel

## God Nodes (most connected - your core abstractions)
1. `App()` - 19 edges
2. `ExpenseItem` - 18 edges
3. `Category` - 13 edges
4. `formatCurrency()` - 10 edges
5. `PaymentMethod` - 9 edges
6. `BudgetData` - 8 edges
7. `useBudget()` - 8 edges
8. `GitHubConfig` - 7 edges
9. `ItemModal()` - 6 edges
10. `useTheme()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `UseBudgetActions` --references--> `ExpenseItem`  [EXTRACTED]
  src/hooks/useBudget.ts → src/types/budget.ts
- `ItemActionsProps` --references--> `ExpenseItem`  [EXTRACTED]
  src/components/BudgetTable.tsx → src/types/budget.ts
- `UseBudgetDependencies` --references--> `GitHubConfig`  [EXTRACTED]
  src/hooks/useBudget.ts → src/api/github.ts
- `UseBudgetState` --references--> `BudgetData`  [EXTRACTED]
  src/hooks/useBudget.ts → src/types/budget.ts
- `SettingsPanelProps` --references--> `GitHubConfig`  [EXTRACTED]
  src/components/SettingsPanel.tsx → src/api/github.ts

## Import Cycles
- None detected.

## Communities (10 total, 2 thin omitted)

### Community 0 - "App shell (App, Collapsible, ItemModal, ThemeToggle)"
Cohesion: 0.13
Nodes (14): App(), Collapsible(), CollapsibleProps, ItemModal(), ThemeToggle(), ThemeToggleProps, DEFAULT_SCENARIO_ID, LOCAL_STORAGE_CONFIG_KEY (+6 more)

### Community 1 - "Expense table & category groups"
Cohesion: 0.17
Nodes (22): BudgetTable(), BudgetTableProps, CategoryGroup(), CategoryGroupProps, ExpenseItemCard(), ExpenseItemRow(), getPaymentMethodName(), ItemActions() (+14 more)

### Community 2 - "useBudget state machine"
Cohesion: 0.22
Nodes (10): generateId(), useBudget(), UseBudgetActions, UseBudgetDependencies, UseBudgetResult, UseBudgetState, mockBudget, config (+2 more)

### Community 3 - "Donut chart"
Cohesion: 0.22
Nodes (9): CategoryLabel(), CategoryLabelProps, DonutChart(), categories, expenses, categories, expenses, CategoryTotal (+1 more)

### Community 4 - "Summary cards & formatting"
Cohesion: 0.29
Nodes (6): SummaryCards(), SummaryCardsProps, TotalIncomeInput(), TotalIncomeInputProps, classNames(), formatCurrency()

### Community 5 - "GitHub Contents API client"
Cohesion: 0.29
Nodes (7): base64ToUtf8(), fetchBudgetFile(), saveBudgetFile(), utf8ToBase64(), BUDGET_FILE_PATH, config, mockBudget

### Community 6 - "Scenario tabs & domain types"
Cohesion: 0.31
Nodes (7): ScenarioTabs(), ScenarioTabsProps, scenarios, BudgetMeta, Income, Scenario, ScenarioId

### Community 7 - "GitHub settings panel"
Cohesion: 0.43
Nodes (4): GitHubConfig, SettingsPanel(), SettingsPanelProps, config

## Knowledge Gaps
- **27 isolated node(s):** `CollapsibleProps`, `UseBudgetResult`, `CategoryLabelProps`, `CategoryTotal`, `SummaryCardsProps` (+22 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 38 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ExpenseItem` connect `Expense table & category groups` to `App shell (App, Collapsible, ItemModal, ThemeToggle)`, `useBudget state machine`, `Donut chart`, `Scenario tabs & domain types`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `App()` connect `App shell (App, Collapsible, ItemModal, ThemeToggle)` to `Expense table & category groups`, `useBudget state machine`, `Donut chart`, `Summary cards & formatting`, `Scenario tabs & domain types`, `GitHub settings panel`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `ItemModal()` connect `App shell (App, Collapsible, ItemModal, ThemeToggle)` to `Expense table & category groups`, `Summary cards & formatting`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `CollapsibleProps`, `UseBudgetResult`, `CategoryLabelProps` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App shell (App, Collapsible, ItemModal, ThemeToggle)` be split into smaller, more focused modules?**
  _Cohesion score 0.1330049261083744 - nodes in this community are weakly interconnected._