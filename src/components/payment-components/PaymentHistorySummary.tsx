import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock, XCircle, Banknote } from 'lucide-react'

interface PaymentHistorySummaryProps {
  totals: {
    paid: number
    pending: number
    failed: number
  }
  transactionCount: number
}

function formatCurrency(amount: number, currency: string = 'PHP') {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function PaymentHistorySummary({ totals, transactionCount }: PaymentHistorySummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <Card className="h-[110px] flex flex-col justify-center ">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <Banknote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totals.paid + totals.pending, 'PHP')}</div>
          <p className="text-xs text-muted-foreground">{transactionCount} total transactions</p>
        </CardContent>
      </Card>

      <Card className="h-[110px] flex flex-col justify-center">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className="text-sm font-medium">Paid</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totals.paid, 'PHP')}</div>
          <p className="text-xs text-muted-foreground">Successfully collected</p>
        </CardContent>
      </Card>

      <Card className="h-[110px] flex flex-col justify-center">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totals.pending, 'PHP')}</div>
          <p className="text-xs text-muted-foreground">Awaiting payment</p>
        </CardContent>
      </Card>

      <Card className="h-[110px] flex flex-col justify-center">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className="text-sm font-medium">Failed</CardTitle>
          <XCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totals.failed, 'PHP')}</div>
          <p className="text-xs text-muted-foreground">Unsuccessful transactions</p>
        </CardContent>
      </Card>
    </div>
  )
}

