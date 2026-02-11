import { useMemo, useState, useCallback, memo } from 'react'
import { format } from 'date-fns'
import { Search, Calendar, RefreshCw, Loader2 } from 'lucide-react'

import { useMembersData } from '@/hooks/membership/useMembers'
import { AddMemberDialog } from '@/components/membership-components/AddMemberDialog'
import type { MemberFormData } from '@/types/membership/memberSchemas'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  onSelectMember: (m: MemberFormData) => void
  pageSize?: number
}

function MembersTable({ onSelectMember, pageSize = 8 }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [pageIndex, setPageIndex] = useState(0)

  const { enrichedMembers, isFetching, error, refetchAll } = useMembersData()

  // Reset page when search changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setPageIndex(0)
  }, [])

  // Memoize filtered members
  const filteredMembers = useMemo(() => {
    if (!searchQuery) return enrichedMembers

    const query = searchQuery.toLowerCase()
    return enrichedMembers.filter(
      (memberGroup) =>
        memberGroup.members.some(
          (m) =>
            m.name.toLowerCase().includes(query) ||
            (m.email ?? '').toLowerCase().includes(query) ||
            (m.phone ?? '').includes(query)
        ) || memberGroup.membershipType.toLowerCase().includes(query)
    )
  }, [enrichedMembers, searchQuery])

  // Memoize pagination
  const pageCount = Math.max(1, Math.ceil(filteredMembers.length / pageSize))
  const pageItems = useMemo(() => {
    const start = pageIndex * pageSize
    return filteredMembers.slice(start, start + pageSize)
  }, [filteredMembers, pageIndex, pageSize])

  // Memoize badge function
  const getMembershipStatusBadge = useCallback((endDate: Date | undefined) => {
    if (!endDate) return <Badge variant="outline">No Date</Badge>

    const today = new Date()
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive">Expired</Badge>
    } else if (daysUntilExpiry <= 7) {
      return <Badge variant="destructive">Expiring Soon</Badge>
    } else if (daysUntilExpiry <= 30) {
      return <Badge variant="outline">Ending Soon</Badge>
    }

    return <Badge variant="default">Active</Badge>
  }, [])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>
          {enrichedMembers.length} {enrichedMembers.length === 1 ? 'member' : 'members'} registered
        </CardDescription>
      </CardHeader>

      <div className="flex-1 min-h-0 overflow-auto">
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name, email, phone, or membership type..."
                className="pl-9 rounded-2xl"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={refetchAll}
                disabled={isFetching}
              >
                {isFetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <AddMemberDialog />
            </div>
          </div>

          {error && (
            <div className="mb-4 text-sm text-destructive" role="alert">
              {error instanceof Error ? error.message : 'Failed to load members.'}
            </div>
          )}

          <Label className="text-xs text-muted-foreground mb-3">Tip: Click a row to view/edit full details and billing.</Label>

          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {enrichedMembers.length === 0
                  ? 'No members registered yet. Add your first member to get started.'
                  : 'No members found matching your search.'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Name</TableHead>
                    <TableHead className="w-[30%]">Duration</TableHead>
                    <TableHead className="w-[15%]">Status</TableHead>
                    <TableHead className="w-[15%]">Plan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((memberGroup) => (
                    <TableRow
                      key={memberGroup.id}
                      role="button"
                      tabIndex={0}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onSelectMember(memberGroup)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onSelectMember(memberGroup)
                        }
                      }}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          {memberGroup.members.map((member, idx) => (
                            <div key={`${member.id}-${idx}`} className="font-medium">
                              {member.name}
                              {memberGroup.members.length > 1 ? (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {idx + 1}/{memberGroup.members.length}
                                </Badge>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          {memberGroup.startDate ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(memberGroup.startDate, 'MMM dd, yyyy')}
                            </div>
                          ) : null}
                          {memberGroup.endDate ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(memberGroup.endDate, 'MMM dd, yyyy')}
                            </div>
                          ) : null}
                        </div>
                      </TableCell>

                      <TableCell>{getMembershipStatusBadge(memberGroup.endDate)}</TableCell>
                      <TableCell>
                        <Badge>{memberGroup.membershipType || '—'}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </div>

      <div className="border-t px-3 py-2 bg-background">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">Page {Math.min(pageIndex + 1, pageCount)} of {pageCount}</div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPageIndex((p) => Math.max(0, p - 1))} disabled={pageIndex <= 0}>
              Prev
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))} disabled={pageIndex >= pageCount - 1}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default memo(MembersTable)
