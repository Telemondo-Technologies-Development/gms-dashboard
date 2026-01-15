import { format } from 'date-fns'
import { Search, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ExpenseFormData } from '@/lib/expense-types'

interface ExpenseTableProps {
  expenses: ExpenseFormData[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddClick: () => void
  onRowClick: (expense: ExpenseFormData) => void
}

export function ExpenseTable({
  expenses,
  searchQuery,
  onSearchChange,
  onAddClick,
  onRowClick,
}: ExpenseTableProps) {
  const getReceiptBadge = (receipt: File | null) => {
    if (receipt) {
      return <Badge variant="default">Yes</Badge>
    }
    return <Badge variant="destructive">No</Badge>
  }

  return (
    <Card className="flex flex-col flex-1 min-h-0">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Expense Records</CardTitle>
        <CardDescription>
          {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'} found
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-4 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by type or name / note..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button className="gap-2" onClick={onAddClick}>
            <Plus className="h-4 w-4" />
            Add New Expense
          </Button>
        </div>

        {expenses.length === 0 ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-muted-foreground">
              No expenses found matching your search.
            </p>
          </div>
        ) : (
          <div className="rounded-md border flex-1 min-h-0 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name / Note</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-center">
                    <div>Receipt</div>
                    <div>Attached?</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow
                    key={expense.id}
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onRowClick(expense)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onRowClick(expense)
                      }
                    }}
                  >
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {expense.type.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{expense.name}</div>
                      {expense.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {expense.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(expense.date, 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ₱{Number.parseFloat(expense.amount).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{getReceiptBadge(expense.receipt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}