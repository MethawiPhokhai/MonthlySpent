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

## Scripts

```bash
npm install
npm run dev      # รัน dev server
npm run build    # build สำหรับ production
npm run test     # รัน tests
npm run deploy   # deploy ไป GitHub Pages (gh-pages branch)
```

## Deploy

GitHub Actions workflow ใน `.github/workflows/deploy.yml` จะ build และ deploy อัตโนมัติเมื่อ push ไป `main`

## ข้อมูล

ข้อมูลหลักเก็บใน `data/budget.json` บน branch `main` เว็บอ่านและเขียนผ่าน GitHub Contents API โดยตรง

ดูรายละเอียดเพิ่มเติมได้ใน [`docs/design-spec.md`](docs/design-spec.md)
