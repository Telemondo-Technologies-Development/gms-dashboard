import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { Search, Plus, Calendar, Receipt, PackageOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { formatPesoStr, formatExpenseType } from '@/lib/expense/expense-utils'
import { DATE_RANGE_OPTIONS, dateRangeStart, type DateRangeOption } from '@/lib/expense/expense-constants'
import type { LegacyExpenseRow } from '@/lib/expense/expense-types'

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const

interface ExpenseTableProps {
  expenses: LegacyExpenseRow[]
  branches: string[]
  /** Controlled from parent so charts stay in sync */
  selectedBranch: string
  onBranchChange: (branch: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddClick: () => void
  onRowClick: (expense: LegacyExpenseRow) => void
}

export function ExpenseTable({
  expenses, branches,
  selectedBranch, onBranchChange,
  searchQuery, onSearchChange,
  onAddClick, onRowClick,
}: ExpenseTableProps) {
  const [dateRange, setDateRange] = useState<DateRangeOption>('3m')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const resetPage = () => setPage(1)

  const filtered = useMemo(() => {
    const rangeStart = dateRangeStart(dateRange)
    return expenses.filter((e) => {
      if (selectedBranch !== 'all' && e.branch !== selectedBranch) return false
      if (rangeStart && new Date(e.date) < rangeStart) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          e.type.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [expenses, selectedBranch, dateRange, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const handleBranchChange = (v: string) => { onBranchChange(v); resetPage() }
  const handleDateRangeChange = (v: DateRangeOption) => { setDateRange(v); resetPage() }
  const handleSearchChange = (q: string) => { onSearchChange(q); resetPage() }
  const handlePageSizeChange = (v: string) => { setPageSize(Number(v)); resetPage() }

  return (
    <Card className="flex flex-col flex-1 min-h-0">
      {/* ── Header ── */}
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Expense Records</CardTitle>
            <CardDescription className="mt-1">View and manage all expense entries</CardDescription>
          </div>
          <Button className="gap-2" onClick={onAddClick}>
            <Plus className="h-4 w-4" /> New Expense
          </Button>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2 pt-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by type, name, or description..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Branch filter — controlled by parent */}
          <Select value={selectedBranch} onValueChange={handleBranchChange}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date range filter */}
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 p-0">
        {filtered.length === 0 ? (
          <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed m-4">
            <div className="text-center py-12 space-y-3">
              <PackageOpen className="h-10 w-10 mx-auto text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? 'No expenses found matching your search.'
                  : 'No expenses recorded for the selected filters.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-md border mx-4 mt-4 flex-1 min-h-0 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="pl-6 pr-2">Type</TableHead>
                  <TableHead className="px-4">Remarks</TableHead>
                  <TableHead className="px-4">Branch</TableHead>
                  <TableHead className="px-4">Date</TableHead>
                  <TableHead className="px-4 text-right">Amount</TableHead>
                  <TableHead className="px-4 text-center">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((expense) => (
                  <TableRow
                    key={expense.id}
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer"
                    onClick={() => onRowClick(expense)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onRowClick(expense)}
                  >
                    <TableCell className="pl-6 pr-2 py-3">
                      <Badge variant="secondary" className="capitalize">
                        {formatExpenseType(expense.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {expense.description
                        ? <span className="text-sm text-muted-foreground truncate max-w-md">{expense.description}</span>
                        : <span className="text-sm text-muted-foreground italic">No remarks</span>}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">{expense.branch}</TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(expense.date, 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right font-medium">{formatPesoStr(expense.amount)}</TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      {expense.receipt ? (
                        <Badge variant="default" className="gap-1 bg-primary">
                          <Receipt className="h-3 w-3" /> Attached
                        </Badge>
                      ) : (
                        <Badge variant="secondary">None</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* ── Footer / Pagination ── */}
        {filtered.length > 0 && (
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="h-8 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={String(s)}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <span>
              {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}