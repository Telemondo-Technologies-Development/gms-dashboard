export type AnalyticsData = {
  monthlyIncome: {
    current: number
    previous: number
    percentChange: number
  }
  annualIncome: {
    current: number
    previous: number
    percentChange: number
  }
  revenueExpense: Array<{
    month: string
    revenue: number
    expense: number
  }>
  membershipGrowth: Array<{
    month: string
    total: number
    new: number
    cancelled: number
  }>
  paymentMethods: Array<{
    method: string
    amount: number
    percentage: number
  }>
  branches: Array<{
    name: string
    revenue: number
    expenses: number
    profit: number
    members: number
    growth: number
  }>
}

export const MOCK_ANALYTICS_DATA: AnalyticsData = {
  monthlyIncome: {
    current: 1200000, // PHP 12,000 in cents
    previous: 923077, // To get 30% increase
    percentChange: 30,
  },
  annualIncome: {
    current: 30000000, // PHP 300,000 in cents
    previous: 42857143, // To get -30% decrease
    percentChange: -30,
  },
  revenueExpense: [
    { month: 'Jan', revenue: 250000, expense: 180000 },
    { month: 'Feb', revenue: 280000, expense: 190000 },
    { month: 'Mar', revenue: 320000, expense: 200000 },
    { month: 'Apr', revenue: 290000, expense: 195000 },
    { month: 'May', revenue: 350000, expense: 210000 },
    { month: 'Jun', revenue: 380000, expense: 220000 },
    { month: 'Jul', revenue: 410000, expense: 230000 },
    { month: 'Aug', revenue: 390000, expense: 225000 },
    { month: 'Sep', revenue: 420000, expense: 235000 },
    { month: 'Oct', revenue: 450000, expense: 240000 },
    { month: 'Nov', revenue: 480000, expense: 250000 },
    { month: 'Dec', revenue: 500000, expense: 260000 },
  ],
  membershipGrowth: [
    { month: 'Jan', total: 150, new: 20, cancelled: 5 },
    { month: 'Feb', total: 165, new: 18, cancelled: 3 },
    { month: 'Mar', total: 180, new: 22, cancelled: 7 },
    { month: 'Apr', total: 195, new: 19, cancelled: 4 },
    { month: 'May', total: 210, new: 25, cancelled: 10 },
    { month: 'Jun', total: 225, new: 23, cancelled: 8 },
    { month: 'Jul', total: 240, new: 28, cancelled: 13 },
    { month: 'Aug', total: 255, new: 20, cancelled: 5 },
    { month: 'Sep', total: 270, new: 22, cancelled: 7 },
    { month: 'Oct', total: 285, new: 24, cancelled: 9 },
    { month: 'Nov', total: 300, new: 21, cancelled: 6 },
    { month: 'Dec', total: 315, new: 19, cancelled: 4 },
  ],
  paymentMethods: [
    { method: 'Cash', amount: 15000000, percentage: 50 },
    { method: 'Card', amount: 7500000, percentage: 25 },
    { method: 'Online', amount: 7500000, percentage: 25 },
  ],
  branches: [
    {
      name: 'Main Branch',
      revenue: 18000000,
      expenses: 12000000,
      profit: 6000000,
      members: 180,
      growth: 12.5,
    },
    {
      name: 'Downtown Branch',
      revenue: 8500000,
      expenses: 6200000,
      profit: 2300000,
      members: 95,
      growth: 8.2,
    },
    {
      name: 'North Branch',
      revenue: 3500000,
      expenses: 2800000,
      profit: 700000,
      members: 40,
      growth: -5.3,
    },
  ],
}