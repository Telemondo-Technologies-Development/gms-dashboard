import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, DollarSign, Package, TrendingUp } from 'lucide-react'
import type { BranchMetrics } from '@/lib/dashboard-utils'

interface BranchPerformanceCardProps {
  metrics: BranchMetrics
  onClick?: () => void
}

export function BranchPerformanceCard({ metrics, onClick }: BranchPerformanceCardProps) {
  const netProfit = metrics.revenue - metrics.expenses
  const profitMargin = metrics.revenue > 0 ? (netProfit / metrics.revenue) * 100 : 0

  return (
    <Card
      className={onClick ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{metrics.name}</CardTitle>
          <Badge variant={profitMargin > 0 ? 'default' : 'destructive'}>
            {profitMargin > 0 ? '+' : ''}
            {profitMargin.toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Members</p>
              <p className="text-sm font-semibold">{metrics.activeMembers}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-sm font-semibold">₱{metrics.revenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-red-600" />
            <div>
              <p className="text-xs text-muted-foreground">Expenses</p>
              <p className="text-sm font-semibold">₱{metrics.expenses.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Assets</p>
              <p className="text-sm font-semibold">{metrics.assets}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Net Profit</span>
            <span className={`text-sm font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₱{netProfit.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
