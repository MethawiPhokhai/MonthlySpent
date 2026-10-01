# AGENTS.md — กติกาสำหรับ AI agent ใน repo นี้

## เริ่มจาก code graph ก่อนเสมอ

repo นี้มี knowledge graph ของโค้ดตัวเองอยู่ที่ [`graphify-out/`](graphify-out/) — **อ่านตรงนี้ก่อนอ่านซอร์ส**

1. [`graphify-out/wiki/index.md`](graphify-out/wiki/index.md) — สารบัญ community + god nodes (~432 tokens)
2. [`graphify-out/GRAPH_REPORT.md`](graphify-out/GRAPH_REPORT.md) — ภาพรวม + ความเชื่อมโยง (~1,368 tokens)
3. หาคำตอบเฉพาะเจาะจง:
   ```bash
   graphify query "how does budget data flow from GitHub to the UI"
   graphify explain "useBudget"
   graphify path "App()" "ExpenseItem"
   graphify affected "ExpenseItem"      # อะไรจะพังถ้าแก้ node นี้
   ```
4. **จึงค่อยเปิดไฟล์ `.ts` / `.tsx` ที่จะแก้จริง** — กราฟช่วยตอน "หา" ไม่ได้แทนการอ่านตอน "แก้"

ถ้าไม่มี `graphify` ในเครื่อง: `pip install graphifyy` (ต้อง Python 3.10+)

## หลังแก้โค้ด

```bash
npm run graph:update    # อัปเดตกราฟ — AST ล้วน ไม่ใช้ LLM ไม่มีค่าใช้จ่าย
```

กราฟที่ไม่ได้อัปเดตจะให้ข้อมูลผิด ถ้าเพิ่ม/ลบไฟล์หรือย้าย module ต้องรันซ้ำ

## ก่อน commit

```bash
npm run typecheck && npm run test && npm run build
```

CI (`.github/workflows/deploy.yml`) รัน 3 อย่างนี้และ deploy ขึ้น GitHub Pages อัตโนมัติเมื่อ push ไป `master`

## โครงสร้างโค้ด

ตาราง community แบบเต็มอยู่ใน [README](README.md#code-graph-graphify) สรุปสั้น ๆ:

- `src/App.tsx` — ประกอบหน้าเข้าด้วยกัน เป็น god node อันดับ 1
- `src/hooks/useBudget.ts` — state machine ของข้อมูล: load → edit → auto-save
- `src/components/*` — presentational ทั้งหมด (props เป็น `readonly`)
- `src/components/BudgetTable.tsx` — จัดกลุ่มรายจ่ายตามหมวด; card บนมือถือ, ตารางบน desktop
- `src/api/github.ts` — GitHub Contents API client (`fetchBudgetFile` / `saveBudgetFile`)
- `src/types/budget.ts` — domain types
- `data/budget.json` — ข้อมูลจริง อ่าน/เขียนผ่าน GitHub API (ไม่ใช่ localStorage)
