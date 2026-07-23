# MonthlySpent

เว็บส่วนตัวสำหรับบันทึกรายรับรายจ่ายรายเดือน รองรับ 2 สถานการณ์ (มีรายได้ / ไม่มีเงินเดือน) แก้ไขเพิ่มลบรายการผ่านหน้าเว็บ เก็บข้อมูลเป็น JSON file ใน git repo และ deploy บน GitHub Pages

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

- สลับสถานการณ์ มีรายได้ / ไม่มีเงินเดือน
- เพิ่ม แก้ไข ลบ รายจ่าย พร้อมจัดหมวดหมู่และวิธีจ่าย
- การ์ดสรุปยอด + กราฟโดนัทสัดส่วนรายจ่าย
- ทุก section พับ/กางได้ (collapsible)
- บนมือถือแสดงรายจ่ายเป็น card อ่านง่าย ไม่ต้อง scroll ซ้ายขวา
- บันทึกขึ้น GitHub อัตโนมัติทุกครั้งที่แก้ไข (หรือกดปุ่มบันทึกเองก็ได้)

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
