# Design Specification: MonthlySpent Budget Website

## 1. เป้าหมาย (Goal)

สร้างเว็บส่วนตัวสำหรับบันทึกรายรับรายจ่ายรายเดือน โดยมีคุณสมบัติหลักดังนี้:

- รองรับ **2 สถานการณ์** คือ "มีรายได้" และ "ไม่มีเงินเดือน" (ตกงาน)
- แก้ไข เพิ่ม ลบ รายการรายรับ/รายจ่ายผ่านหน้าเว็บ
- แสดงภาพรวมรายรับรายจ่าย พร้อมกราฟและเปอร์เซ็นต์ คล้ายกับสเปรดชีตที่ให้มา
- เก็บข้อมูลเป็น **JSON file** ใน **git repository** เดียวกัน
- **Deploy บน GitHub Pages เท่านั้น** ไม่มี backend ของตัวเอง

## 2. ข้อจำกัดและข้อตกลง (Constraints)

| ข้อจำกัด | รายละเอียด |
|---|---|
| ผู้ใช้ | 1 คน (personal use) |
| Hosting | GitHub Pages จาก static build |
| Backend | ไม่มี ต้องใช้ GitHub API จาก browser โดยตรง |
| ข้อมูล | JSON file ชื่อ `data/budget.json` บน branch `main` |
| สกุลเงิน | THB (บาท) |

## 3. สถาปัตยกรรมระดับสูง (High-level Architecture)

```
┌─────────────────────────────────────┐
│  GitHub Pages (static build)        │
│  ┌───────────────────────────────┐  │
│  │ React SPA                     │  │
│  │ • Tabs สลับ scenario          │  │
│  │ • Modal form CRUD             │  │
│  │ • Summary + Donut chart       │  │
│  └───────────────────────────────┘  │
└────────────┬────────────────────────┘
             │ fetch (CORS)
             ▼
┌─────────────────────────────────────┐
│  GitHub REST API                    │
│  • GET /contents/data/budget.json   │
│  • PUT /contents/data/budget.json   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  data/budget.json ใน git repo         │
└─────────────────────────────────────┘
```

### การอ่าน/เขียนข้อมูล

1. **อ่านข้อมูล**: `GET https://api.github.com/repos/{owner}/{repo}/contents/data/budget.json`
   - รับ `content` เป็น base64 → decode → parse JSON
2. **เขียนข้อมูล**: `PUT https://api.github.com/repos/{owner}/{repo}/contents/data/budget.json`
   - ต้อง `GET` เอา `sha` ล่าสุดก่อน
   - encode JSON เป็น base64 แล้วส่งพร้อม `sha` และ commit message
3. **Authentication**: ใช้ **fine-grained personal access token** ของ user เอง ผ่าน header `Authorization: Bearer {token}`

## 4. Data Model

### 4.1 Schema

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
      "income": {
        "total": 103000
      },
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
      "income": {
        "total": 0
      },
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

### 4.2 โครงสร้างรายการ

**รายรับ (per scenario)**

| Field | Type | คำอธิบาย |
|---|---|---|
| `income.total` | number | รายรับรวมของ scenario นั้น ๆ |

**รายจ่าย (per item)**

| Field | Type | คำอธิบาย |
|---|---|---|
| `id` | string | unique ภายใน scenario |
| `name` | string | ชื่อรายการ |
| `amount` | number | จำนวนเงิน THB |
| `categoryId` | string | อ้างอิง `categories[].id` |
| `paymentMethodId` | string \| null | อ้างอิง `paymentMethods[].id` |
| `due` | string | รอบ/วันครบกำหนด (เช่น `monthly`, `5/12`, `11/70`, `End of Feb`) |
| `note` | string | หมายเหตุ (optional) |

### 4.3 หลักการ

- แต่ละ scenario มี income total เป็นตัวเลขเดียว ไม่แยกเป็นรายการ
- รายจ่ายแยกตาม category โดยใช้ `categoryId`
- สีของ category เก็บใน lookup `categories` ใช้ร่วมกันทั้ง 2 scenario
- วิธีการจ่ายเก็บใน lookup `paymentMethods`
- totals ทั้งหมดคำนวณจาก UI ไม่เก็บใน JSON

## 5. UI/UX Design

### 5.1 หน้าหลัก (Dashboard)

```
┌─────────────────────────────────────────────────────────┐
│  MonthlySpent                           [⚙️ Settings]     │
├─────────────────────────────────────────────────────────┤
│  [ มีรายได้ ] [ ไม่มีเงินเดือน ]  ← Tabs สลับ scenario   │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ รายรับรวม    │  │ รายจ่ายรวม  │  │ เหลือ        │  │
│  │ ฿103,000     │  │ ฿41,699      │  │ ฿61,301       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌───────────────────────────┐ │
│  │ กราฟ Donut          │  │ รายจ่ายตามหมวดหมู่       │ │
│  │ (แบ่งตาม category)  │  │ ตารางรายการ + ปุ่ม Add   │ │
│  └─────────────────────┘  └───────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 5.2 องค์ประกอบหลัก

| Component | หน้าที่ |
|---|---|
| `ScenarioTabs` | แท็บสลับระหว่าง "มีรายได้" / "ไม่มีเงินเดือน" |
| `SummaryCards` | แสดง รายรับรวม / รายจ่ายรวม / คงเหลือ |
| `DonutChart` | กราฟโดนัทแสดงสัดส่วนรายจ่ายตาม category |
| `BudgetTable` | ตารางรายจ่าย แบ่ง group ตาม category มีปุ่ม Edit/Delete |
| `TotalIncomeInput` | ช่องใส่รายรับรวมของ scenario |
| `ItemModal` | Modal form สำหรับเพิ่ม/แก้ไขรายจ่าย |
| `SettingsPanel` | ช่องใส่ GitHub token, repo owner/name, sync status |

### 5.3 Flow การแก้ไขรายการ

1. ผู้ใช้กดปุ่ม **+ เพิ่มรายจ่าย** หรือกดไอคอน ✏️ ที่รายการ
2. เปิด `ItemModal` แสดงฟอร์ม:
   - ชื่อรายการ
   - จำนวนเงิน
   - หมวดหมู่ (dropdown)
   - วิธีจ่าย (dropdown)
   - รอบ/วันครบกำหนด (text)
   - หมายเหตุ (optional)
3. กด **บันทึก** → อัปเดต state ใน memory → เรียก GitHub API PUT → บันทึกลง `data/budget.json`
4. กดปุ่ม 🗑️ → ยืนยันใน modal → ลบรายการ → บันทึกลง JSON

### 5.4 หน้าตาสไตล์

- **Clean web UI** ไม่ clone Excel เป๊ะ ๆ
- ใช้ card, spacing, rounded corner, สีหมวดหมู่ตาม `category.color`
- แสดงตัวเลขเงินด้วย comma separator และสกุลเงิน ฿
- รองรับ responsive แต่ optimize สำหรับ desktop เป็นหลัก

## 6. Tech Stack

| Layer | เลือก | เหตุผล |
|---|---|---|
| Framework | React 18 + TypeScript | Component model, type safety, ecosystem ใหญ่ |
| Build tool | Vite | Fast, ผลิต static build ง่าย, เหมาะกับ GitHub Pages |
| Styling | Tailwind CSS | Utility-first, responsive, สร้าง UI ได้เร็ว |
| Charting | Recharts | React-native, ทำ donut chart ได้ง่าย |
| GitHub API | Native `fetch` | ไม่ต้อง dependency ใหญ่ สำหรับ API ไม่ซับซ้อน |
| Deploy | GitHub Pages (`gh-pages` branch) | ฟรี ติดกับ repo สะดวก |
| State | React `useState`/`useEffect` + `localStorage` | เก็บ token และข้อมูลชั่วคราว |

### 7. API Contract

#### 7.1 อ่านข้อมูล

```http
GET /repos/{owner}/{repo}/contents/data/budget.json
Authorization: Bearer {token}
Accept: application/vnd.github+json
```

Response (simplified):

```json
{
  "name": "budget.json",
  "path": "data/budget.json",
  "sha": "abc123...",
  "content": "eyJtZXRhIjog...",
  "encoding": "base64"
}
```

#### 7.2 เขียนข้อมูล

```http
PUT /repos/{owner}/{repo}/contents/data/budget.json
Authorization: Bearer {token}
Accept: application/vnd.github+json
```

Body:

```json
{
  "message": "update budget via MonthlySpent",
  "content": "eyJtZXRhIjog...",
  "sha": "abc123..."
}
```

## 8. Deployment Guide

### 8.1 สร้าง repo

1. สร้าง repo บน GitHub ชื่อ `MonthlySpent` (private แนะนำถ้าข้อมูลการเงินเป็นความลับ)
2. เปิด GitHub Pages: **Settings → Pages → Source: Deploy from a branch → `gh-pages` branch**

### 8.2 สร้าง GitHub token

1. **Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. สร้าง token ให้มี permission **Contents: read and write** สำหรับ repo `MonthlySpent`
3. คัดลอก token ไว้

### 8.3 เริ่มต้นโปรเจกต์

```bash
npm create vite@latest MonthlySpent -- --template react-ts
cd MonthlySpent
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install recharts
npm install -D gh-pages
```

### 8.4 Vite config

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/MonthlySpent/',
})
```

### 8.5 package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  }
}
```

### 8.6 Deploy

```bash
npm run build
npm run deploy
```

หรือใช้ GitHub Actions workflow อัตโนมัติ:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [master]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 9. Security & Risk

| ความเสี่ยง | การจัดการ |
|---|---|
| PAT อยู่ใน browser | ใช้ **fine-grained token** เฉพาะ repo นี้ เก็บใน `localStorage` ของเครื่องตัวเอง ไม่ hardcode ใน code |
| ข้อมูลการเงินเปิดเผย | แนะนำใช้ **private repo** + GitHub Pro สำหรับ private GitHub Pages |
| หลายเครื่องเขียนทับกัน | ก่อน write ต้อง GET เอา `sha` ล่าสุด ถ้า GitHub ตอบ `409 Conflict` ให้ refetch แล้วแจ้ง user |
| Token หลุด | ให้ user สามารถ revoke token บน GitHub ได้ทันที แนะนำ rotate เป็นระยะ |

## 10. Out of Scope

- Multi-user / authentication แบบ login
- Mobile app / native app
- Backend หรือ database server
- การ sync อัตโนมัติ real-time ระหว่างอุปกรณ์
- การนำเข้า/ส่งออก CSV/Excel
- การแปลงข้อมูลทั้งหมดจากรูปเป็น seed file

## 11. Future Extensions

- รองรับ import/export CSV
- สร้างรายงานรายเดือน/รายปี
- แจ้งเตือนรายการใกล้ครบกำหนด
- รองรับหลายสกุลเงิน
- ทำ PWA สำหรับ offline read

---

*Generated from the wayfinder map at `docs/wayfinder/map.md`.*
