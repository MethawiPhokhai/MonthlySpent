---
labels: wayfinder:research
assignee: opencode
status: closed
---

## Question

What JSON schema should represent the two budget scenarios and their income/expense items?

Design a schema that supports:

- Two separate scenarios: normal income (`active`) and unemployed (`bare-minimum`).
- Each scenario has its own income items and expense items.
- Each item has at least: name, amount in THB, category, payment method, and due date / recurrence info.
- Categories should be shareable across scenarios and support color or display metadata.
- The schema should be easy to read, easy to edit by hand, and easy to render into the dashboard.

Provide a concrete example JSON file with a few items that mirror the data in the provided image.

## Resolution

**Date:** 2026-07-16
**Decision:** ใช้ JSON schema แบบ **scenario-centric** กับ categories/payment methods เป็น global lookup

### Schema หลัก

```json
{
  "meta": {
    "currency": "THB",
    "version": "1.0.0"
  },
  "scenarios": [
    {
      "id": "employed",
      "name": "มีรายได้",
      "description": "งบประมาณตอนทำงานปกติ",
      "income": [
        { "id": "paycheck", "name": "Paycheck", "amount": 103000, "note": "" }
      ],
      "expenses": [
        {
          "id": "saving",
          "name": "เงินเก็บ",
          "amount": 12000,
          "categoryId": "savings",
          "paymentMethodId": "dime",
          "due": "monthly",
          "note": ""
        }
      ]
    },
    {
      "id": "unemployed",
      "name": "ไม่มีเงินเดือน",
      "description": "กรณีไม่มีเงินเดือนจริง ๆ",
      "income": [],
      "expenses": []
    }
  ],
  "categories": [
    { "id": "savings", "name": "เงินเก็บ", "color": "#81C784" },
    { "id": "investment", "name": "ลงทุน", "color": "#64B5F6" },
    { "id": "utilities", "name": "ค่าใช้จ่าย", "color": "#FFB74D" },
    { "id": "bills", "name": "บิลรายเดือน", "color": "#AED581" },
    { "id": "subscriptions", "name": "สมัครสมาชิก", "color": "#F06292" },
    { "id": "food", "name": "กิน", "color": "#DCE775" },
    { "id": "misc", "name": "อื่น ๆ", "color": "#7986CB" }
  ],
  "paymentMethods": [
    { "id": "ktb", "name": "KTB" },
    { "id": "kbank", "name": "Kbank" },
    { "id": "make", "name": "Make" },
    { "id": "dime", "name": "Dime" },
    { "id": "office", "name": "Office" }
  ]
}
```

### โครงสร้างรายการ

**Income item**
- `id` — unique string ภายใน scenario
- `name` — ชื่อรายได้
- `amount` — จำนวนเงิน (number)
- `note` — ข้อความเสริม (optional)

**Expense item**
- `id` — unique string ภายใน scenario
- `name` — ชื่อรายการ
- `amount` — จำนวนเงิน (number)
- `categoryId` — อ้างอิง `categories[].id`
- `paymentMethodId` — อ้างอิง `paymentMethods[].id` หรือ `null`
- `due` — ข้อความอธิบายรอบ/วันครบกำหนด เช่น `monthly`, `5/12`, `11/70`, `End of Feb`
- `note` — ข้อความเสริม (optional)

### ทำไมถึงออกแบบแบบนี้

1. **แยก scenario ชัดเจน** — แต่ละ scenario มี income/expenses ของตัวเอง สลับดูได้ง่าย ตรงกับ requirement A ที่เลือกไว้
2. **Categories / payment methods แยกเป็น lookup** — สีและชื่อหมวดหมู่ consistency ระหว่าง scenario; จัดการที่จุดเดียว
3. **`due` เป็น string อิสระ** — ข้อมูลในรูปมีหลายรูปแบบ (installment, วันที่, รอบ) ไม่ควร lock เป็น structure ตอนนี้
4. **ไม่เก็บ totals** — คำนวณจาก UI เอา เพื่อไม่ให้ข้อมูลซ้ำซ้อน/ขาดตก
5. **อ่าน/แก้ด้วยมือง่าย** — JSON อ่านเข้าใจได้ สอดคล้องกับเป้าหมายที่อยากเก็บบน git

### ตัวอย่างข้อมูลจากรูป (subset)

ดูไฟล์ `docs/wayfinder/assets/budget-seed.json` ถ้าต้องการ seed data แบบสมบูรณ์

### Consequences for other tickets

- [005] Dashboard prototype สามารถสร้างตาม schema นี้ได้ทันที
- [004] Tech stack รู้แล้วว่าต้องรองรับ JSON file + schema นี้
- การ transcribe ข้อมูลทั้งหมดจากรูปเป็น seed file อยู่นอก scope ของ design spec นี้

## Depends on

- None
