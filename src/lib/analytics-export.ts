import type { AnalyticsData } from './analytics-data'

type ExportData = {
  branch: string
  timeRange: string
  analytics: AnalyticsData
}

export function exportToPDF(data: ExportData) {
  const { branch, analytics } = data

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(value / 100)
  }

  const revenueExpenseRows = analytics.revenueExpense
    .map(
      (row) => `
      <tr>
        <td>${row.month}</td>
        <td style="text-align: right; color: #16a34a">${formatCurrency(row.revenue)}</td>
        <td style="text-align: right; color: #dc2626">${formatCurrency(row.expense)}</td>
        <td style="text-align: right; font-weight: 600">${formatCurrency(row.revenue - row.expense)}</td>
      </tr>
    `
    )
    .join('')

  const branchRows = analytics.branches
    .map(
      (branch) => `
      <tr>
        <td>${branch.name}</td>
        <td style="text-align: right">${formatCurrency(branch.revenue)}</td>
        <td style="text-align: right">${formatCurrency(branch.expenses)}</td>
        <td style="text-align: right; font-weight: 600">${formatCurrency(branch.profit)}</td>
        <td style="text-align: right">${branch.members}</td>
        <td style="text-align: right; color: ${branch.growth >= 0 ? '#16a34a' : '#dc2626'}">${branch.growth >= 0 ? '+' : ''}${branch.growth}%</td>
      </tr>
    `
    )
    .join('')

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Financial Analytics Report - ${branch}</title>
  <style>
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      padding: 40px;
      max-width: 1000px;
      margin: 0 auto;
      line-height: 1.6;
    }
    .header {
      border-bottom: 3px solid #4a5c92;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      margin: 0;
      color: #1f2937;
      font-size: 28px;
    }
    .subtitle {
      color: #6b7280;
      margin-top: 8px;
    }
    .section {
      margin-bottom: 40px;
    }
    .section h2 {
      color: #1f2937;
      font-size: 20px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    .kpi-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
    }
    .kpi-label {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .kpi-value {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
    }
    .kpi-change {
      font-size: 14px;
      font-weight: 600;
      margin-top: 4px;
    }
    .kpi-change.positive {
      color: #16a34a;
    }
    .kpi-change.negative {
      color: #dc2626;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
    }
    th {
      background-color: #f9fafb;
      text-align: left;
      padding: 12px;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #f3f4f6;
    }
    tr:hover {
      background-color: #f9fafb;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 12px;
    }
    .payment-methods {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .payment-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .payment-percentage {
      font-size: 28px;
      font-weight: 700;
      color: #4a5c92;
    }
    .payment-amount {
      color: #6b7280;
      font-size: 14px;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Financial Analytics Report</h1>
    <div class="subtitle">
      Branch: ${branch === 'all' ? 'All Branches' : branch} | 
      Generated: ${new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
  </div>

  <div class="section">
    <h2>Income Overview</h2>
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Monthly Income (January 2026)</div>
        <div class="kpi-value">${formatCurrency(analytics.monthlyIncome.current)}</div>
        <div class="kpi-change ${analytics.monthlyIncome.percentChange >= 0 ? 'positive' : 'negative'}">
          ${analytics.monthlyIncome.percentChange >= 0 ? '↑' : '↓'} ${Math.abs(analytics.monthlyIncome.percentChange)}% from last month
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Annual Income (2025)</div>
        <div class="kpi-value">${formatCurrency(analytics.annualIncome.current)}</div>
        <div class="kpi-change ${analytics.annualIncome.percentChange >= 0 ? 'positive' : 'negative'}">
          ${analytics.annualIncome.percentChange >= 0 ? '↑' : '↓'} ${Math.abs(analytics.annualIncome.percentChange)}% from 2024
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Payment Method Distribution</h2>
    <div class="payment-methods">
      ${analytics.paymentMethods.map(method => `
        <div class="payment-card">
          <div style="font-weight: 600; margin-bottom: 8px">${method.method}</div>
          <div class="payment-percentage">${method.percentage}%</div>
          <div class="payment-amount">${formatCurrency(method.amount)}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <h2>Revenue vs. Expenses (2025)</h2>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th style="text-align: right">Revenue</th>
          <th style="text-align: right">Expenses</th>
          <th style="text-align: right">Net Profit</th>
        </tr>
      </thead>
      <tbody>
        ${revenueExpenseRows}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Branch Performance Comparison</h2>
    <table>
      <thead>
        <tr>
          <th>Branch</th>
          <th style="text-align: right">Revenue</th>
          <th style="text-align: right">Expenses</th>
          <th style="text-align: right">Profit</th>
          <th style="text-align: right">Members</th>
          <th style="text-align: right">Growth</th>
        </tr>
      </thead>
      <tbody>
        ${branchRows}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>This report was automatically generated by the Gym Fitness Management System.</p>
    <p>For questions or concerns, please contact your system administrator.</p>
  </div>
</body>
</html>
  `

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    
    setTimeout(() => {
      printWindow.print()
    }, 500)
  } else {
    alert('Please allow popups to export PDF reports')
  }
}

export function exportToExcel(data: ExportData) {
  const { branch, analytics } = data

  const formatCurrency = (value: number) => {
    return (value / 100).toFixed(2)
  }

  let csv = 'Financial Analytics Report\n'
  csv += `Branch: ${branch === 'all' ? 'All Branches' : branch}\n`
  csv += `Generated: ${new Date().toLocaleDateString('en-PH')}\n\n`

  csv += 'INCOME OVERVIEW\n'
  csv += 'Period,Amount,Change\n'
  csv += `Monthly (January 2026),${formatCurrency(analytics.monthlyIncome.current)},${analytics.monthlyIncome.percentChange}%\n`
  csv += `Annual (2025),${formatCurrency(analytics.annualIncome.current)},${analytics.annualIncome.percentChange}%\n\n`

  csv += 'PAYMENT METHOD DISTRIBUTION\n'
  csv += 'Method,Amount,Percentage\n'
  analytics.paymentMethods.forEach(method => {
    csv += `${method.method},${formatCurrency(method.amount)},${method.percentage}%\n`
  })
  csv += '\n'

  csv += 'REVENUE VS EXPENSES (2025)\n'
  csv += 'Month,Revenue,Expenses,Net Profit\n'
  analytics.revenueExpense.forEach(row => {
    const profit = row.revenue - row.expense
    csv += `${row.month},${formatCurrency(row.revenue)},${formatCurrency(row.expense)},${formatCurrency(profit)}\n`
  })
  csv += '\n'

  csv += 'MEMBERSHIP GROWTH\n'
  csv += 'Month,Total Members,New Members,Cancelled,Net Change\n'
  analytics.membershipGrowth.forEach(row => {
    const netChange = row.new - row.cancelled
    csv += `${row.month},${row.total},${row.new},${row.cancelled},${netChange}\n`
  })
  csv += '\n'

  csv += 'BRANCH PERFORMANCE\n'
  csv += 'Branch,Revenue,Expenses,Profit,Members,Growth\n'
  analytics.branches.forEach(branch => {
    csv += `${branch.name},${formatCurrency(branch.revenue)},${formatCurrency(branch.expenses)},${formatCurrency(branch.profit)},${branch.members},${branch.growth}%\n`
  })

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `analytics-report-${branch}-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}