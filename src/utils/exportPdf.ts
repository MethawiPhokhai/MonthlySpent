import type { Category, ExpenseItem, PaymentMethod, Scenario } from '../types/budget'
import { formatCurrency } from './format'

/** Escape text for safe insertion into the export HTML. */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

interface ExportGroup {
  readonly name: string
  readonly items: ExpenseItem[]
  readonly total: number
}

/**
 * Group expenses by the category order defined in `data/budget.json`.
 * Expenses whose category id is unknown fall into a trailing "ไม่ระบุหมวด" group
 * so no amount is ever dropped from the export.
 */
export function groupExpensesByCategory(expenses: ExpenseItem[], categories: Category[]): ExportGroup[] {
  const known = new Set(categories.map((category) => category.id))
  const groups: ExportGroup[] = categories
    .map((category) => {
      const items = expenses.filter((item) => item.categoryId === category.id)
      return { name: category.name, items, total: sumAmounts(items) }
    })
    .filter((group) => group.items.length > 0)

  const orphans = expenses.filter((item) => !known.has(item.categoryId))
  if (orphans.length > 0) {
    groups.push({ name: 'ไม่ระบุหมวด', items: orphans, total: sumAmounts(orphans) })
  }
  return groups
}

function sumAmounts(items: ExpenseItem[]): number {
  return items.reduce((sum, item) => sum + item.amount, 0)
}

function paymentName(paymentMethods: PaymentMethod[], id: string | null): string {
  return paymentMethods.find((method) => method.id === id)?.name ?? '-'
}

/** Build a self-contained, print-ready HTML document of all expenses grouped by category. */
export function buildExpenseReportHtml(
  scenario: Scenario,
  categories: Category[],
  paymentMethods: PaymentMethod[],
  generatedAt: Date = new Date(),
): string {
  const groups = groupExpensesByCategory(scenario.expenses, categories)
  const totalExpenses = sumAmounts(scenario.expenses)
  const balance = scenario.income.total - totalExpenses

  const sections = groups
    .map((group) => {
      const rows = group.items
        .map(
          (item) => `<tr>
  <td>${escapeHtml(item.name)}</td>
  <td>${escapeHtml(item.due || '-')}</td>
  <td>${escapeHtml(paymentName(paymentMethods, item.paymentMethodId))}</td>
  <td class="num">${escapeHtml(formatCurrency(item.amount))}</td>
</tr>`,
        )
        .join('\n')
      return `<section>
<h2>${escapeHtml(group.name)} <span class="sub">${escapeHtml(formatCurrency(group.total))}</span></h2>
<table>
<thead><tr><th>รายการ</th><th>กำหนด</th><th>ชำระผ่าน</th><th class="num">จำนวน</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
</section>`
    })
    .join('\n')

  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<title>MonthlySpent - ${escapeHtml(scenario.name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 16mm; }
  body { font-family: 'Sarabun', sans-serif; color: #111; font-size: 13px; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .meta { color: #555; margin-bottom: 14px; }
  .summary { display: flex; gap: 16px; margin-bottom: 18px; }
  .summary div { border: 1px solid #999; padding: 6px 10px; flex: 1; }
  .summary b { display: block; font-size: 15px; }
  section { margin-bottom: 14px; break-inside: avoid; }
  h2 { font-size: 15px; border-bottom: 2px solid #111; padding-bottom: 3px; margin: 0 0 4px; }
  .sub { float: right; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 3px 6px; border-bottom: 1px solid #ddd; }
  th { font-size: 11px; color: #555; }
  .num { text-align: right; white-space: nowrap; }
  .grand { font-size: 15px; font-weight: 700; text-align: right; margin-top: 10px; }
</style>
</head>
<body>
<h1>MonthlySpent — ${escapeHtml(scenario.name)}</h1>
<p class="meta">${escapeHtml(scenario.description || '')} · สร้างเมื่อ ${escapeHtml(generatedAt.toLocaleString('th-TH'))}</p>
<div class="summary">
  <div>รายรับรวม<b>${escapeHtml(formatCurrency(scenario.income.total))}</b></div>
  <div>รายจ่ายรวม<b>${escapeHtml(formatCurrency(totalExpenses))}</b></div>
  <div>คงเหลือ<b>${escapeHtml(formatCurrency(balance))}</b></div>
</div>
${sections}
<p class="grand">รายจ่ายรวมทั้งหมด ${escapeHtml(formatCurrency(totalExpenses))}</p>
</body>
</html>`
}

/**
 * Open the report in a new window and trigger the browser's print dialog,
 * where "Save as PDF" produces the downloadable file. Returns false if the
 * popup was blocked.
 */
export function downloadExpensePdf(html: string): boolean {
  const win = window.open('', '_blank')
  if (!win) return false
  win.document.open()
  win.document.write(html)
  win.document.close()
  win.onload = () => {
    win.focus()
    win.print()
  }
  return true
}
