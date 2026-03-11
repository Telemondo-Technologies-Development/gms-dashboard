import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Search, Download, RefreshCw, Users, ChevronRight, Clock } from 'lucide-react'

import { useMembersData } from '@/hooks/membership/useMembershipMemberQuery'
import { useMemberSubscriptions } from '@/hooks/membership/useMembershipSubscriptionsQuery'
import { usePaymentHistoryInvoicesQuery } from '@/hooks/billing/usePaymentHistoryInvoicesQuery'
import type { MemberTableDTO } from '@/api/generated/models/MemberTableDTO'
import type { MemberSubscriptionTableDTO } from '@/api/generated/models/MemberSubscriptionTableDTO'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MemberProgressSheet, deriveMemberStatus } from '@/components/membership-components/MembershipProgressSheet'

export const Route = createFileRoute('/dashboard/marketing/membership/data')({
  component: RouteComponent,
})

const PAGE_SIZE = 10

function statusVariant(status: string | undefined): 'default' | 'secondary' | 'destructive' | 'outline' | 'tertiary' {
  if (status === 'ACTIVE') return 'default'
  if (status === 'DEACTIVATED') return 'tertiary'
  return 'destructive'
}

function exportToCsv(rows: MemberTableDTO[]) {
  const headers = ['First Name', 'Middle Name', 'Surname', 'Suffix', 'Status', 'Created By', 'Updated By']
  const csvRows = rows.map((r) =>
    [
      r.firstName,
      r.middleName ?? '',
      r.surname,
      r.suffix ?? '',
      r.status,
      [r.createdByFirstName, r.createdBySurname].filter(Boolean).join(' '),
      [r.updatedByFirstName, r.updatedBySurname].filter(Boolean).join(' '),
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...csvRows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `membership-data-${format(new Date(), 'yyyy-MM-dd')}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [selectedMember, setSelectedMember] = useState<MemberTableDTO | null>(null)
  const [progressOpen, setProgressOpen] = useState(false)

  const { isLoading, isFetching, error, refetchAll, queries } = useMembersData()
  const subsQuery = useMemberSubscriptions()
  const invoicesQuery = usePaymentHistoryInvoicesQuery(0, 500)
  const rawMembers: MemberTableDTO[] = queries.members.data ?? []
  const allSubs: MemberSubscriptionTableDTO[] = subsQuery.data ?? []
  const allInvoices = invoicesQuery.data ?? []

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return rawMembers
    const q = searchQuery.toLowerCase()
    return rawMembers.filter((m) =>
      [m.firstName, m.middleName, m.surname, m.suffix, m.status,
       m.createdByFirstName, m.createdBySurname,
       m.updatedByFirstName, m.updatedBySurname]
        .some((v) => v?.toLowerCase().includes(q)),
    )
  }, [rawMembers, searchQuery])

  const pageCount = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE))
  const pageItems = filteredMembers.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setPageIndex(0)
  }

  return (
    <>
      <Card className="flex flex-col shadow-md border-muted/40 w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">Member Records</CardTitle>
              <CardDescription className="mt-1">
                {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} total
                {isFetching && !isLoading && (
                  <span className="ml-2 text-xs text-muted-foreground/60">Refreshing...</span>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="px-3 py-1 text-sm">
                Total: {filteredMembers.length}
              </Badge>
              <Button variant="outline" size="sm" onClick={refetchAll} disabled={isFetching} className="h-9">
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="flex-1 min-h-0 overflow-auto">
          <CardContent className="p-0">
            <div className="p-4 border-b bg-muted/5 flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  placeholder="Search by name, status..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 h-10 w-full bg-background/50 border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-offset-0"
                />
              </div>
              <div className="flex items-center ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCsv(filteredMembers)}
                  disabled={filteredMembers.length === 0}
                  className="h-9"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-sm text-muted-foreground">Loading member records...</div>
            ) : error ? (
              <div className="m-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2" role="alert">
                <span className="font-semibold">Error:</span>
                {(error as Error).message || 'Failed to load member records.'}
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No members found</h3>
                <p className="text-muted-foreground max-w-sm">
                  {searchQuery ? 'Try adjusting your search query.' : 'No member records are available yet.'}
                </p>
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b border-muted/60">
                      <TableHead className="pl-6 w-[28%]">Member</TableHead>
                      <TableHead className="w-[12%]">Status</TableHead>
                      <TableHead className="w-[20%]">Created By</TableHead>
                      <TableHead className="w-[20%]">Updated By</TableHead>
                      <TableHead className="pr-6 w-[20%] text-right">Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageItems.map((m) => {
                      const fullName = [m.firstName, m.middleName, m.surname, m.suffix].filter(Boolean).join(' ')
                      const createdBy = [m.createdByFirstName, m.createdBySurname].filter(Boolean).join(' ') || '-'
                      const updatedBy = [m.updatedByFirstName, m.updatedBySurname].filter(Boolean).join(' ') || '-'
                      const subCount = allSubs.filter((s) => s.actorId === m.actorId).length
                      return (
                        <TableRow key={m.id} className="hover:bg-muted/40 transition-colors group border-b border-muted/40">
                          <TableCell className="pl-6 py-4 align-top">
                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {fullName}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 align-top">
                            {(() => {
                              const ds = deriveMemberStatus(m, allSubs, allInvoices)
                              return (
                                <Badge variant={statusVariant(ds)} className="whitespace-nowrap">
                                  {ds}
                                </Badge>
                              )
                            })()}
                          </TableCell>
                          <TableCell className="py-4 align-top text-sm text-muted-foreground">
                            {createdBy}
                          </TableCell>
                          <TableCell className="py-4 align-top text-sm text-muted-foreground">
                            {updatedBy}
                          </TableCell>
                          <TableCell className="pr-6 py-4 align-top text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1.5 text-xs"
                              onClick={() => {
                                setSelectedMember(m)
                                setProgressOpen(true)
                              }}
                            >
                              <Clock className="h-3.5 w-3.5" />
                              {subCount > 0 ? `${subCount} subscription${subCount !== 1 ? 's' : ''}` : 'View Progress'}
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                  <TableFooter className="bg-muted/5">
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={5} className="p-0">
                        <div className="flex flex-col items-center gap-2 p-4 sm:flex-row sm:justify-between w-full">
                          <span className="text-sm text-center text-muted-foreground sm:text-left">
                            Showing {Math.min(pageIndex * PAGE_SIZE + 1, filteredMembers.length)} to{' '}
                            {Math.min((pageIndex + 1) * PAGE_SIZE, filteredMembers.length)} of{' '}
                            {filteredMembers.length} entries
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                              disabled={pageIndex <= 0}
                              className="h-8 px-3 text-xs"
                            >
                              Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              Page {pageIndex + 1} / {pageCount}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
                              disabled={pageIndex >= pageCount - 1}
                              className="h-8 px-3 text-xs"
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      <MemberProgressSheet
        member={selectedMember}
        subscriptions={allSubs}
        invoices={allInvoices}
        open={progressOpen}
        onOpenChange={setProgressOpen}
      />
    </>
  )
}
