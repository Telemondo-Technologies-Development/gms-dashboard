import type { AnalyticsData } from '@/lib/analytics/analytics-data'
type ExportData = {
  branch: string
  timeRange: string
  analytics: AnalyticsData
}

type RevenueExpenseRow = AnalyticsData['revenueExpense'][number]
type MembershipGrowthRow = AnalyticsData['membershipGrowth'][number]
type PaymentMethodRow = AnalyticsData['paymentMethods'][number]
type BranchRow = AnalyticsData['branches'][number]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value / 100)

const formatCurrencyRaw = (value: number) => (value / 100).toFixed(2)

function currentMonthLabel(): string {
  const now = new Date()
  return now.toLocaleDateString('en-PH', { year: 'numeric', month: 'long' })
}

function currentAndPrevYear(): { current: number; previous: number } {
  const year = new Date().getFullYear()
  return { current: year, previous: year - 1 }
}

// ---------------------------------------------------------------------------
// PDF Export
// ---------------------------------------------------------------------------

export function exportToPDF(data: ExportData): void {
  const { branch, analytics } = data
  const { current: currentYear, previous: prevYear } = currentAndPrevYear()

  const revenueExpenseRows = analytics.revenueExpense
    .map(
      (row: RevenueExpenseRow) => `
      <tr>
        <td>${row.month}</td>
        <td style="text-align:right;color:#16a34a">${formatCurrency(row.revenue)}</td>
        <td style="text-align:right;color:#dc2626">${formatCurrency(row.expense)}</td>
        <td style="text-align:right;font-weight:600">${formatCurrency(row.revenue - row.expense)}</td>
      </tr>`,
    )
    .join('')

  const branchRows = analytics.branches
    .map(
      (b: BranchRow) => `
      <tr>
        <td>${b.name}</td>
        <td style="text-align:right">${formatCurrency(b.revenue)}</td>
        <td style="text-align:right">${formatCurrency(b.expenses)}</td>
        <td style="text-align:right;font-weight:600">${formatCurrency(b.profit)}</td>
        <td style="text-align:right">${b.members}</td>
        <td style="text-align:right;color:${b.growth >= 0 ? '#16a34a' : '#dc2626'}">
          ${b.growth >= 0 ? '+' : ''}${b.growth}%
        </td>
      </tr>`,
    )
    .join('')

  const monthlyChange = analytics.monthlyIncome.percentChange
  const annualChange = analytics.annualIncome.percentChange
  const generatedDate = new Date().toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const displayBranch = branch === 'all' ? 'All Branches' : branch

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Financial Analytics Report — ${displayBranch}</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, -apple-system, Arial, sans-serif; padding: 40px; max-width: 1000px; margin: 0 auto; line-height: 1.6; }
    .header { border-bottom: 3px solid #4a5c92; padding-bottom: 20px; margin-bottom: 30px; }
    h1 { margin: 0; color: #1f2937; font-size: 28px; }
    .subtitle { color: #6b7280; margin-top: 8px; }
    .section { margin-bottom: 40px; }
    .section h2 { color: #1f2937; font-size: 20px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }
    .kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
    .kpi-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; }
    .kpi-label { color: #6b7280; font-size: 14px; margin-bottom: 8px; }
    .kpi-value { font-size: 32px; font-weight: 700; color: #1f2937; }
    .kpi-change { font-size: 14px; font-weight: 600; margin-top: 4px; }
    .positive { color: #16a34a; }
    .negative { color: #dc2626; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { background-color: #f9fafb; text-align: left; padding: 12px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; }
    td { padding: 12px; border-bottom: 1px solid #f3f4f6; }
    tr:hover { background-color: #f9fafb; }
    .payment-methods { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .payment-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center; }
    .payment-percentage { font-size: 28px; font-weight: 700; color: #4a5c92; }
    .payment-amount { color: #6b7280; font-size: 14px; margin-top: 4px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Financial Analytics Report</h1>
    <div class="subtitle">Branch: ${displayBranch} &nbsp;|&nbsp; Generated: ${generatedDate}</div>
  </div>

  <div class="section">
    <h2>Income Overview</h2>
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Monthly Income (${currentMonthLabel()})</div>
        <div class="kpi-value">${formatCurrency(analytics.monthlyIncome.current)}</div>
        <div class="kpi-change ${monthlyChange >= 0 ? 'positive' : 'negative'}">
          ${monthlyChange >= 0 ? '↑' : '↓'} ${Math.abs(monthlyChange)}% from last month
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Annual Income (${prevYear})</div>
        <div class="kpi-value">${formatCurrency(analytics.annualIncome.current)}</div>
        <div class="kpi-change ${annualChange >= 0 ? 'positive' : 'negative'}">
          ${annualChange >= 0 ? '↑' : '↓'} ${Math.abs(annualChange)}% from ${prevYear - 1}
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Payment Method Distribution</h2>
    <div class="payment-methods">
      ${analytics.paymentMethods
        .map(
          (m: PaymentMethodRow) => `
        <div class="payment-card">
          <div style="font-weight:600;margin-bottom:8px">${m.method}</div>
          <div class="payment-percentage">${m.percentage}%</div>
          <div class="payment-amount">${formatCurrency(m.amount)}</div>
        </div>`,
        )
        .join('')}
    </div>
  </div>

  <div class="section">
    <h2>Revenue vs. Expenses (${currentYear})</h2>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th style="text-align:right">Revenue</th>
          <th style="text-align:right">Expenses</th>
          <th style="text-align:right">Net Profit</th>
        </tr>
      </thead>
      <tbody>${revenueExpenseRows}</tbody>
    </table>
  </div>

  <div class="section">
    <h2>Branch Performance Comparison</h2>
    <table>
      <thead>
        <tr>
          <th>Branch</th>
          <th style="text-align:right">Revenue</th>
          <th style="text-align:right">Expenses</th>
          <th style="text-align:right">Profit</th>
          <th style="text-align:right">Members</th>
          <th style="text-align:right">Growth</th>
        </tr>
      </thead>
      <tbody>${branchRows}</tbody>
    </table>
  </div>

  <div class="footer">
    <p>This report was automatically generated by the Gym Fitness Management System.</p>
    <p>For questions or concerns, please contact your system administrator.</p>
  </div>
</body>
</html>`

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => printWindow.print(), 500)
  } else {
    alert('Please allow pop-ups to export PDF reports.')
  }
}

// ---------------------------------------------------------------------------
// Excel (CSV) Export
// ---------------------------------------------------------------------------

export function exportToExcel(data: ExportData): void {
  const { branch, analytics } = data
  const { current: currentYear, previous: prevYear } = currentAndPrevYear()
  const displayBranch = branch === 'all' ? 'All Branches' : branch

  const lines: string[] = [
    'Financial Analytics Report',
    `Branch: ${displayBranch}`,
    `Generated: ${new Date().toLocaleDateString('en-PH')}`,
    '',
    'INCOME OVERVIEW',
    'Period,Amount (PHP),Change',
    `Monthly (${currentMonthLabel()}),${formatCurrencyRaw(analytics.monthlyIncome.current)},${analytics.monthlyIncome.percentChange}%`,
    `Annual (${prevYear}),${formatCurrencyRaw(analytics.annualIncome.current)},${analytics.annualIncome.percentChange}%`,
    '',
    'PAYMENT METHOD DISTRIBUTION',
    'Method,Amount (PHP),Percentage',
    ...analytics.paymentMethods.map((m: PaymentMethodRow) => `${m.method},${formatCurrencyRaw(m.amount)},${m.percentage}%`),
    '',
    `REVENUE VS EXPENSES (${currentYear})`,
    'Month,Revenue (PHP),Expenses (PHP),Net Profit (PHP)',
    ...analytics.revenueExpense.map((row: RevenueExpenseRow) => {
      const profit = row.revenue - row.expense
      return `${row.month},${formatCurrencyRaw(row.revenue)},${formatCurrencyRaw(row.expense)},${formatCurrencyRaw(profit)}`
    }),
    '',
    'MEMBERSHIP GROWTH',
    'Month,Total Members,New Members,Cancelled,Net Change',
    ...analytics.membershipGrowth.map((row: MembershipGrowthRow) => {
      const net = row.new - row.cancelled
      return `${row.month},${row.total},${row.new},${row.cancelled},${net}`
    }),
    '',
    'BRANCH PERFORMANCE',
    'Branch,Revenue (PHP),Expenses (PHP),Profit (PHP),Members,Growth',
    ...analytics.branches.map((b: BranchRow) =>
      `${b.name},${formatCurrencyRaw(b.revenue)},${formatCurrencyRaw(b.expenses)},${formatCurrencyRaw(b.profit)},${b.members},${b.growth}%`,
    ),
  ]

  const csv = lines.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `analytics-report-${branch}-${new Date().toISOString().split('T')[0]}.csv`
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}