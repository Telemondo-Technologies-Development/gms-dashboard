import { ArrowDown, ArrowUp, TrendingUp } from 'lucide-react'
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

  const sortedBranches = [...data.branches].sort((a, b) => b.profit - a.profit)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%]">Branch</TableHead>
            <TableHead className="w-[18%]">Revenue</TableHead>
            <TableHead className="w-[18%]">Expenses</TableHead>
            <TableHead className="w-[18%]">Profit</TableHead>
            <TableHead className="w-[13%]">Members</TableHead>
            <TableHead className="w-[8%] text-right">Growth</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedBranches.map((branch, index) => (
            <TableRow key={branch.name}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {index === 0 && (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  )}
                  {branch.name}
                </div>
              </TableCell>
              <TableCell className="font-semibold text-green-700">
                {formatCurrency(branch.revenue)}
              </TableCell>
              <TableCell className="font-semibold text-red-700">
                {formatCurrency(branch.expenses)}
              </TableCell>
              <TableCell className="font-bold">
                {formatCurrency(branch.profit)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {branch.members}
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}