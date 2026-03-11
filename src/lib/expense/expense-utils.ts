export const formatPeso = (value: number) =>
  `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const formatPesoStr = (amount: string) =>
  formatPeso(parseFloat(amount))

export const formatExpenseType = (type: string) =>
  type.replaceAll('-', ' ')

export const formatPesoCompact = (value: number) =>
  value >= 1_000_000
    ? `₱${(value / 1_000_000).toFixed(1)}M`
    : `₱${(value / 1000).toFixed(0)}k`