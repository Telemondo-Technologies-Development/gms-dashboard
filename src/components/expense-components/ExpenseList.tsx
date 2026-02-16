import { format } from 'date-fns'
import { Search, Plus, Calendar } from 'lucide-react'
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
  const formatAmount = (amount: string) => {
    return `₱${parseFloat(amount).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  const getReceiptBadge = (receipt: File | null) => {
    return receipt 
      ? <Badge variant="default" className="bg-primary">Attached</Badge>
      : <Badge variant="secondary">None</Badge>
  }

  const formatExpenseType = (type: string) => {
    return type.replace('-', ' ')
  }

  const handleKeyDown = (e: React.KeyboardEvent, expense: ExpenseFormData) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onRowClick(expense)
    }
  }

  return (
    <Card className="flex flex-col flex-1 min-h-0">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Expense Records</CardTitle>
            <CardDescription className="mt-1">
              View and manage all expense entries
            </CardDescription>
          </div>
          <Button className="gap-2" onClick={onAddClick}>
            <Plus className="h-4 w-4" />
            New Expense
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        {/* Search Section */}
        <div className="flex-shrink-0 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by type, name, or description..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table Content */}
        {expenses.length === 0 ? (
          <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'No expenses found matching your search.'
                  : 'No expenses recorded yet. Click "New Expense" to get started.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border flex-1 min-h-0 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="pl-6">Type</TableHead>
                  <TableHead>Name / Note</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow
                    key={expense.id}
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer"
                    onClick={() => onRowClick(expense)}
                    onKeyDown={(e) => handleKeyDown(e, expense)}
                  >
                    <TableCell className="pl-6">
                      <Badge variant="secondary" className="capitalize">
                        {formatExpenseType(expense.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{expense.name}</div>
                        {expense.description && (
                          <div className="text-sm text-muted-foreground truncate max-w-md">
                            {expense.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(expense.date, 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">
                        {formatAmount(expense.amount)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getReceiptBadge(expense.receipt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {expenses.length > 0 && (
          <div className="flex-shrink-0 mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}