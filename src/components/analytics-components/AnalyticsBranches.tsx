import { ArrowDown, ArrowUp } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { AnalyticsData } from '@/lib/analytics-data'

type Props = {
  data: AnalyticsData
}

export function BranchPerformanceTable({ data }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(value / 100)
  }

  // Validate data
  if (!data.branches?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No branch data available
      </div>
    )
  }

  const sortedBranches = [...data.branches].sort((a, b) => b.profit - a.profit)

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%] min-w-[150px]">Branch</TableHead>
            <TableHead className="w-[18%] min-w-[100px]">Revenue</TableHead>
            <TableHead className="w-[18%] min-w-[100px]">Expenses</TableHead>
            <TableHead className="w-[18%] min-w-[100px]">Profit</TableHead>
            <TableHead className="w-[13%] min-w-[80px]">Members</TableHead>
            <TableHead className="w-[8%] min-w-[80px] text-right">Growth</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedBranches.map((branch) => {
            const profitMargin = ((branch.profit / branch.revenue) * 100).toFixed(1)
            
            return (
              <TableRow key={branch.name}>
                <TableCell className="font-medium">
                  {branch.name}
                </TableCell>
                <TableCell className="font-semibold text-green-600">
                  {formatCurrency(branch.revenue)}
                </TableCell>
                <TableCell className="font-semibold text-red-600">
                  {formatCurrency(branch.expenses)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold">{formatCurrency(branch.profit)}</span>
                    <span className="text-xs text-muted-foreground">
                      {profitMargin}% margin
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {branch.members.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${
                    branch.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {branch.growth >= 0 ? (
                      <ArrowUp className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5" />
                    )}
                    {Math.abs(branch.growth)}%
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}