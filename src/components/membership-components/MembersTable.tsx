import { useMemo, useState, useCallback, memo } from 'react'
import { format } from 'date-fns'
import { Search, Calendar, RefreshCw, Loader2, User, Mail, Phone, CreditCard } from 'lucide-react'

import { useMembersData } from '@/hooks/membership/useMembers'
import { AddMemberDialog } from '@/components/membership-components/AddMemberDialog'
import type { MemberFormData } from '@/types/membership/memberSchemas'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
  onSelectMember: (m: MemberFormData) => void
  pageSize?: number
}

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
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
    if (!endDate) return <Badge variant="destructive">Expired</Badge>

    const today = new Date()
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive">Expired</Badge>
    } else if (daysUntilExpiry <= 3) {
      return <Badge className="bg-red-500 hover:bg-red-600">Expiring Soon</Badge>
    } else if (daysUntilExpiry <= 7) {
      return <Badge className="bg-orange-500 hover:bg-orange-600">Ending Soon</Badge>
    }
    return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
  }, [])

  return (
    <Card className="flex flex-col h-full shadow-md border-muted/40">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">Members Record</CardTitle>
            <CardDescription className="mt-1">
              Manage your {enrichedMembers.length} {enrichedMembers.length === 1 ? 'member' : 'members'} and their subscription details.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="px-3 py-1 text-sm">
            Total: {enrichedMembers.length}
          </Badge>
        </div>
      </CardHeader>

      <div className="flex-1 min-h-0 overflow-auto ">
        <CardContent className="p-0">
          <div className="px-6 py-4 border-b bg-muted/5 flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search members..."
                className="pl-9 h-10 bg-background/50 border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-offset-0"
              />
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={refetchAll}
                disabled={isFetching}
                className="h-10 w-10 shrink-0"
              >
                {isFetching ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
              <AddMemberDialog />
            </div>
          </div>

          {error && (
            <div className="m-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2" role="alert">
              <span className="font-semibold">Error:</span>
              {error instanceof Error ? error.message : 'Failed to load members.'}
            </div>
          )}

          {filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No members found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1">
                {enrichedMembers.length === 0
                  ? 'Get started by adding your first member to the system.'
                  : `No results matching "${searchQuery}". Try a different search term.`}
              </p>
            </div>
          ) : (
            <div className="relative">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-b border-muted/60">
                    <TableHead className="w-[35%] pl-6 py-4 font-semibold text-foreground/70">Member Details</TableHead>
                    <TableHead className="w-[25%] py-4 font-semibold text-foreground/70">Plan & Billing</TableHead>
                    <TableHead className="w-[25%] py-4 font-semibold text-foreground/70">Subscription Period</TableHead>
                    <TableHead className="w-[15%] py-4 font-semibold text-foreground/70 text-right pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((memberGroup) => {
                    const mainMember = memberGroup.members[0]
                    const otherMembersCount = Math.max(0, memberGroup.members.length - 1)
                    
                    return (
                      <TableRow
                        key={memberGroup.id}
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer hover:bg-muted/40 transition-colors group border-b border-muted/40"
                        onClick={() => onSelectMember(memberGroup)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            onSelectMember(memberGroup)
                          }
                        }}
                      >
                        <TableCell className="pl-6 py-4 align-top">
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{mainMember.name}</span>
                                {otherMembersCount > 0 && (
                                  <Badge variant="default" className="h-5 px-1.5 text-[10px] bg-muted-foreground/15 text-muted-foreground hover:bg-muted-foreground/25">
                                    +{otherMembersCount} others
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                                {mainMember.email && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center gap-1.5 max-w-48">
                                          <Mail className="h-3 w-3 shrink-0 opacity-70" />
                                          <span className="truncate">{mainMember.email}</span>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{mainMember.email}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                                {mainMember.phone && (
                                  <div className="flex items-center gap-1.5">
                                    <Phone className="h-3 w-3 shrink-0 opacity-70" />
                                    <span>{mainMember.phone}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4 align-top">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-medium border-primary/20 bg-primary/5 text-primary">
                                {memberGroup.membershipType || "Standard"} 
                              </Badge>
                              {memberGroup.membershipDuration && (
                                <span className="text-xs text-muted-foreground font-medium px-1.5 py-0.5 rounded-sm bg-muted">
                                  {memberGroup.membershipDuration}
                                </span>
                              )}
                            </div>
                            
                            {(memberGroup.billingAmount || memberGroup.billingCycle) && (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <CreditCard className="h-3.5 w-3.5 opacity-70" />
                                <span>
                                  {memberGroup.billingAmount ? `₱${memberGroup.billingAmount}` : '—'}
                                  {memberGroup.billingCycle ? ` / ${memberGroup.billingCycle}` : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="py-4 align-top">
                          <div className="flex flex-col gap-1.5">
                            {memberGroup.startDate && memberGroup.endDate ? (
                              <>
                                <div className="flex items-center gap-2 text-sm text-foreground/80">
                                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="font-medium">
                                    {format(memberGroup.startDate, 'MMM d, yyyy')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground pl-[0.35rem] border-l-2 border-muted ml-1.5 py-0.5">
                                  <span className="ml-2">Ends {format(memberGroup.endDate, 'MMM d, yyyy')}</span>
                                </div>
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground italic">No active subscription</span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="py-4 align-top text-right pr-6">
                          {getMembershipStatusBadge(memberGroup.endDate)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </div>

      <div className="border-t bg-muted/5 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground font-medium">
            Showing {Math.min(pageIndex * pageSize + 1, filteredMembers.length)} to {Math.min((pageIndex + 1) * pageSize, filteredMembers.length)} of {filteredMembers.length} entries
          </div>
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
      </div>
    </Card>
  )
}

export default memo(MembersTable)
