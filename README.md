# MonthlySpent

เว็บส่วนตัวสำหรับบันทึกรายรับรายจ่ายรายเดือน (สถานการณ์ "มีรายได้") แก้ไขเพิ่มลบรายการผ่านหน้าเว็บ เก็บข้อมูลเป็น JSON file ใน git repo และ deploy บน GitHub Pages

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts
- GitHub REST API (client-side)

## การตั้งค่า

1. Fork หรือ clone repo นี้
2. สร้าง GitHub Personal Access Token (fine-grained) ที่มีสิทธิ์ **Contents: read and write** สำหรับ repo นี้
3. เปิดเว็บ กรอก Owner, Repo, Token แล้วกด "โหลดข้อมูล"
4. เริ่มแก้ไขรายรับรายจ่ายได้เลย

## Features

- ธีมมืด (dark mode) เป็นค่าเริ่มต้น + ปุ่มสลับเป็นธีมสว่างที่จำค่าไว้ใน browser
- แถบสลับสถานการณ์แสดงเฉพาะเมื่อมีมากกว่า 1 scenario ใน JSON
- เพิ่ม แก้ไข ลบ รายจ่าย พร้อมจัดหมวดหมู่และวิธีจ่าย
- การ์ดสรุปยอด + กราฟโดนัทสัดส่วนรายจ่าย
- ทุก section พับ/กางได้ (collapsible)
- บนมือถือแสดงรายจ่ายเป็น card อ่านง่าย ไม่ต้อง scroll ซ้ายขวา
- บันทึกขึ้น GitHub อัตโนมัติทุกครั้งที่แก้ไข (หรือกดปุ่มบันทึกเองก็ได้)

## Code Graph (graphify)

repo นี้มี **knowledge graph ของโค้ดตัวเอง** อยู่ที่ [`graphify-out/`](graphify-out/) — ใช้เป็นจุดเริ่มต้นก่อนอ่านโค้ด จะเร็วกว่าและประหยัด token กว่าไล่อ่านทุกไฟล์

| ไฟล์ | ใช้ทำอะไร |
|---|---|
| [`graphify-out/wiki/index.md`](graphify-out/wiki/index.md) | **จุดเริ่มต้นสำหรับ AI** — สารบัญ community + god nodes |
| [`graphify-out/GRAPH_REPORT.md`](graphify-out/GRAPH_REPORT.md) | god nodes, ความเชื่อมโยงน่าสนใจ, import cycles, คำถามที่กราฟตอบได้ |
| [`graphify-out/graph.json`](graphify-out/graph.json) | กราฟเต็ม (123 nodes / 283 edges) สำหรับ `query` / `path` / `explain` |
| [graph.html](https://methawiphokhai.github.io/MonthlySpent/graph.html) | กราฟแบบ interactive เปิดในเบราว์เซอร์ |

### โครงสร้างโค้ดตามกราฟ (10 communities)

| Community | ไฟล์หลัก | หน้าที่ |
|---|---|---|
| App shell + ธีม (29) | `App.tsx`, `Collapsible`, `ItemModal`, `ThemeToggle`, `constants.ts` | ประกอบหน้า, modal, สลับธีม |
| Expense table (26) | `components/BudgetTable.tsx` | จัดกลุ่มรายจ่ายตามหมวด — card บนมือถือ, ตารางบน desktop |
| useBudget state machine (14) | `hooks/useBudget.ts` | load → edit → auto-save |
| Donut chart (13) | `components/DonutChart.tsx` | กราฟสัดส่วนรายจ่ายตามหมวด |
| Summary & formatting (12) | `SummaryCards.tsx`, `TotalIncomeInput.tsx`, `utils/format.ts` | การ์ดสรุปยอด + จัดรูปเงิน/class |
| GitHub API client (10) | `api/github.ts` | GitHub Contents API (fetch/save `data/budget.json`) |
| Scenario tabs & types (10) | `types/budget.ts`, `components/ScenarioTabs.tsx` | type ของ domain |
| Settings panel (7) | `components/SettingsPanel.tsx` | owner/repo/token + สถานะ sync |

**God nodes** (concept ที่ทุกอย่างวิ่งผ่าน) — `App()` 19 · `ExpenseItem` 18 · `Category` 13 · `formatCurrency()` 10 · `PaymentMethod` 9 · `BudgetData` 8 · `useBudget()` 8 · `GitHubConfig` 7
**Import cycles:** ไม่มี

### คำสั่งที่ใช้บ่อย

```bash
npm run graph          # สร้างกราฟใหม่ทั้งรอบ (AST ล้วน ไม่ใช้ LLM ไม่มีค่าใช้จ่าย)
npm run graph:update   # อัปเดตหลังแก้โค้ด (เร็ว)
graphify query "how does budget data flow from GitHub to the UI"
graphify explain "useBudget"
graphify path "App()" "ExpenseItem"
```

### ประหยัด token แค่ไหน (วัดจริงใน repo นี้)

| วิธี | token |
|---|---|
| อ่าน `src/` ทั้งหมด (34 ไฟล์) | 18,134 |
| อ่าน `wiki/index.md` เพื่อทำความเข้าใจโครงสร้าง | **432** (42x น้อยกว่า) |
| อ่าน `GRAPH_REPORT.md` | **1,368** (13x น้อยกว่า) |
| `graphify query` 1 คำถาม | 1,402 – 5,781 |

ข้อจำกัดที่ต้องรู้: กราฟช่วยตอน **"หา"** ไม่ได้ช่วยตอน **"แก้"** — ไฟล์ที่จะแก้ยังต้องอ่านจริง · กราฟจะให้ข้อมูลผิดถ้าไม่รีเฟรช (รัน `npm run graph:update` หลังแก้โค้ด) · สถาปัตยกรรมที่เปลี่ยนจะไม่โผล่จนกว่าจะรันซ้ำ

## Scripts

```bash
npm install
npm run dev        # รัน dev server
npm run build      # build สำหรับ production
npm run test       # รัน tests
npm run typecheck  # เช็ค TypeScript types
```

## Deploy

GitHub Actions workflow ใน `.github/workflows/deploy.yml` จะ test, build และ deploy อัตโนมัติเมื่อ push ไป `master`

## โครงสร้างโค้ด

```
src/
  api/github.ts           # GitHub Contents API client (fetch/save budget.json)
  hooks/useBudget.ts      # data lifecycle: load -> edit -> auto-save
  hooks/useLocalStorage.ts
  hooks/useTheme.ts       # theme state; keeps the `dark` class on <html> in sync
  components/             # presentational components (props เป็น readonly ทั้งหมด)
  utils/                  # formatCurrency, getCategoryTotals
  types/budget.ts         # shared domain types
  constants.ts            # storage key, file path, default scenario
data/budget.json          # ข้อมูลหลัก อ่าน/เขียนผ่าน GitHub API
```

### Data lifecycle

ทุกการแก้ไขไหลตามลำดับนี้เสมอ:

```
event (user แก้ไข) -> setData -> render -> auto-save effect -> PUT ขึ้น GitHub
```

เพื่อให้ข้อมูลที่ส่งขึ้น server เป็นข้อมูลล่าสุดเสมอ ไม่มีการอ่าน state ระหว่าง render
(ดู comment แบ่ง lifecycle ไว้ใน `src/hooks/useBudget.ts`)

ดูรายละเอียดเพิ่มเติมได้ใน [`docs/design-spec.md`](docs/design-spec.md)
