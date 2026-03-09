import { useMemo, useState, useCallback, memo, useEffect } from 'react'
import { format } from 'date-fns'
import { Search, Calendar as CalendarIcon, RefreshCw, Loader2, User, Mail, CreditCard, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

import { useMembersData } from '@/hooks/membership/useMembership'
import { useAttendanceEligibility } from '@/hooks/membership/useMembershipAttendanceEligibility'
import { useAttendance } from '@/hooks/membership/useMembershipAttendance'
import { parseCalendarDay, toStartOfDay } from '@/lib/date-utils'
import { cn } from '@/lib/utils'
import { AddMemberDialog } from '@/components/membership-components/MembershipAddFormDialog'
import { DeleteAdminConfirmDialog } from '@/components/common/DeleteAdminConfirm'
import { getAuthenticatedApi } from '@/lib/api-client'
import { useAuthSession } from '@/lib/auth/auth-session'
import { useSelectedBranchId } from '@/hooks/useSelectedBranchId'
import { MemberApi } from '@/api/generated/apis/MemberApi'
import { AttendanceApi } from '@/api/generated/apis/AttendanceApi'
import { AttendancePostDTOSourceEnum, AttendancePostDTOTypeEnum } from '@/api/generated/models/AttendancePostDTO'
import { memberQueryKeys } from '@/lib/QueryKeys'
import type { MemberFormData } from '@/types/membership/MembershipManagementSchema'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Props {
  onSelectMember: (m: MemberFormData) => void
}

function sortMembersByDateStack(members: MemberFormData[]): MemberFormData[] {
  return [...members].sort((left, right) => {
    const leftTime = left.startDate ? new Date(left.startDate).getTime() : 0
    const rightTime = right.startDate ? new Date(right.startDate).getTime() : 0

    if (rightTime !== leftTime) {
      return rightTime - leftTime
    }

    return right.id.localeCompare(left.id)
  })
}

function MembersTable({ onSelectMember }: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<MemberFormData | null>(null)
  const PAGE_SIZE = 5

  const { enrichedMembers, isFetching, error, refetchAll } = useMembersData()
  const navigate = useNavigate()
  const attendanceQuery = useAttendance()
  const session = useAuthSession()
  const selectedBranchId = useSelectedBranchId()
  const queryClient = useQueryClient()
  const { getAttendanceEligibility } = useAttendanceEligibility()

  const todayAttendedActorIds = useMemo(() => {
    const today = toStartOfDay(new Date()).getTime()
    const ids = new Set<string>()

    for (const record of attendanceQuery.data ?? []) {
      if (record.type !== 'IN' || !record.actorId || !record.recordedAt) continue
      const recordedDay = toStartOfDay(new Date(record.recordedAt)).getTime()
      if (recordedDay === today) {
        ids.add(record.actorId)
      }
    }

    return ids
  }, [attendanceQuery.data])

  // Derive membership status from subscription dates — single source of truth
  // used by both the badge renderer and the attendance eligibility gate
  const getMembershipStatus = useCallback((startDate: Date | undefined, endDate: Date | undefined) => {
    if (!startDate) return 'INACTIVE' as const

    const today = new Date()
    if (!endDate) {
      return startDate <= today ? ('ONGOING' as const) : ('PENDING' as const)
    }

    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntilExpiry < 0) return 'EXPIRED' as const
    if (daysUntilExpiry <= 3) return 'EXPIRING_SOON' as const
    if (daysUntilExpiry <= 7) return 'ENDING_SOON' as const
    return 'ACTIVE' as const
  }, [])

  const getEffectiveAttendanceEligibility = useCallback(
    (memberGroup: MemberFormData) => {
      // Uses the proven toStartOfDay-normalised eligibility hook as the primary gate
      const base = getAttendanceEligibility(memberGroup)
      if (!base.isEligible) return base

      // Secondary gate: already attended today
      if (memberGroup.actorId && todayAttendedActorIds.has(memberGroup.actorId)) {
        return { isEligible: false, reason: 'Attendance already recorded for this member today.' }
      }

      return base
    },
    [getAttendanceEligibility, todayAttendedActorIds],
  )

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const api = getAuthenticatedApi(MemberApi)
      await api.deleteMember({ id })
    },
    onSuccess: () => {
      refetchAll()
    },
  })

  const addAttendanceMutation = useMutation({
    mutationFn: async (memberGroup: MemberFormData) => {
      const eligibility = getEffectiveAttendanceEligibility(memberGroup)
      if (!eligibility.isEligible) {
        throw new Error(eligibility.reason ?? 'Cannot add attendance for this member.')
      }

      const actorId = memberGroup.actorId
      if (!actorId) {
        throw new Error('Cannot add attendance: member has no actor id.')
      }

      const createdById = session.actorId
      if (!createdById) {
        throw new Error('Cannot add attendance: current user actor id is missing.')
      }

      if (!selectedBranchId) {
        throw new Error('Cannot add attendance: no branch selected.')
      }

      const attendanceApi = getAuthenticatedApi(AttendanceApi)
      const response = await attendanceApi.createAttendance({
        attendancePostDTO: {
          actorId,
          branchId: selectedBranchId,
          createdById,
          recordedAt: new Date(),
          source: AttendancePostDTOSourceEnum.Manual,
          type: AttendancePostDTOTypeEnum.In,
        },
      })

      const firstApiError = response.errors?.[0]?.description?.trim()
      if (firstApiError) {
        throw new Error(firstApiError)
      }

      if (!response.success) {
        throw new Error(response.message ?? 'Failed to add attendance.')
      }

      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [memberQueryKeys.attendances] })
      toast.success('Attendance added.')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to add attendance.')
    },
  })

  // Reset page when search changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setPageIndex(0)
  }, [])

  const handleSelectedDayChange = useCallback((value: string) => {
    setSelectedDay(value)
    setPageIndex(0)
  }, [])

  // Memoize filtered members
  const filteredMembers = useMemo(() => {
    const query = searchQuery.toLowerCase()
    const targetDay = parseCalendarDay(selectedDay)

    const matchedMembers = enrichedMembers.filter((memberGroup) => {
      const matchesSearch = !searchQuery
        ? true
        : memberGroup.members.some(
            (m) =>
              m.name.toLowerCase().includes(query) ||
              (m.email ?? '').toLowerCase().includes(query) ||
              (m.phone ?? '').includes(query)
          ) || memberGroup.membershipType.toLowerCase().includes(query)

      const matchesSelectedDay = !targetDay
        ? true
        : (() => {
            if (!memberGroup.startDate) {
              return false
            }

            const startDay = toStartOfDay(new Date(memberGroup.startDate))
            const endDay = memberGroup.endDate ? toStartOfDay(new Date(memberGroup.endDate)) : null

            if (startDay > targetDay) {
              return false
            }

            if (endDay && endDay < targetDay) {
              return false
            }

            return true
          })()

      return matchesSearch && matchesSelectedDay
    })

    return sortMembersByDateStack(matchedMembers)
  }, [enrichedMembers, searchQuery, selectedDay])

  // Memoize pagination
  const pageCount = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE))
  const pageItems = useMemo(() => {
    const start = pageIndex * PAGE_SIZE
    return filteredMembers.slice(start, start + PAGE_SIZE)
  }, [filteredMembers, pageIndex, PAGE_SIZE])

  useEffect(() => {
    if (pageIndex > 0 && pageIndex >= pageCount) {
      setPageIndex(pageCount - 1)
    }
  }, [pageCount, pageIndex])

  // No subscription at all → Inactive
  // startDate only (no endDate) → Active continuous billing, no expiry
  // startDate + endDate → time-bounded; check expiry window
  const getMembershipStatusBadge = useCallback((startDate: Date | undefined, endDate: Date | undefined) => {
    const status = getMembershipStatus(startDate, endDate)
    switch (status) {
      case 'INACTIVE':  return <Badge variant="destructive" className="">Inactive</Badge>
      case 'PENDING':   return <Badge variant="secondary" className="text-muted-foreground">Pending</Badge>
      case 'ACTIVE': case 'ONGOING' :  return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      case 'ENDING_SOON':   return <Badge className="bg-orange-500 hover:bg-orange-600">Ending Soon</Badge>
      case 'EXPIRING_SOON': return <Badge className="bg-red-500 hover:bg-red-600">Expiring Soon</Badge>
      case 'EXPIRED':   return <Badge variant="destructive">Expired</Badge>
    }
  }, [getMembershipStatus])

  return (
    <Card className="flex flex-col shadow-md border-muted/40 max-h-[88vh]">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">Members Record</CardTitle>
            <CardDescription className="mt-1">
              Manage your {enrichedMembers.length} {enrichedMembers.length === 1 ? 'member' : 'members'} and their subscription details.
            </CardDescription>
          </div>
          <Badge variant="default" className="px-3 py-1 text-sm">
            Total: {enrichedMembers.length}
          </Badge>
        </div>
      </CardHeader>

      <div>
        <CardContent className="p-0">
          <div className="p-4 border-b bg-muted/5 flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search members..."
                className="pl-9 h-10 w-full bg-background/50 border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-offset-0"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto md:ml-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal h-10 w-full sm:w-auto bg-background/50 border-muted-foreground/20',
                      !selectedDay && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {selectedDay ? format(new Date(selectedDay), 'MMM d, yyyy') : 'Select Date'}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDay ? parseCalendarDay(selectedDay) ?? undefined : undefined}
                    onSelect={(date) => {
                      handleSelectedDayChange(date ? format(date, 'yyyy-MM-dd') : '')
                    }}
                    initialFocus
                  />
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectedDayChange('')}
                    >
                      Clear
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSelectedDayChange(format(new Date(), 'yyyy-MM-dd'))}
                    >
                      Today
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button onClick={() => navigate({ to: "/dashboard/marketing/membership/data" })}>
                Data
              </Button>
                            
              <div className="flex items-center gap-2 justify-end">
                <AddMemberDialog />
              </div>
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
              <h3 className="text-lg font-semibold mb-2">No members found</h3>
              <p className="text-muted-foreground max-w-sm mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-b border-muted/60">
                    <TableHead className="w-[30%] pl-6">Name</TableHead>
                    <TableHead className="w-[25%]">Plan & Billing</TableHead>
                    <TableHead className="w-[20%]">Subscription Period</TableHead>
                    <TableHead className="w-[15%]">Status</TableHead>
                    <TableHead className="w-[10%] pr-6 text-right whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((memberGroup) => {
                    const mainMember = memberGroup.members[0]
                    const attendanceEligibility = getEffectiveAttendanceEligibility(memberGroup)
                    
                    return (
                      <TableRow
                        key={memberGroup.id}
                        className="hover:bg-muted/40 transition-colors group border-b border-muted/40"
                      >
                        <TableCell className="pl-6 py-4 align-top">
                          <div className="flex items-start gap-3 w-full min-w-0">
                            <div className="flex flex-col gap-0.5 w-full min-w-0">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2 w-full min-w-0">
                                <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate w-full lg:max-w-none">
                                  {memberGroup.members[0]?.name || 'Unknown Member'}
                                </span>
                              </div>
                              {/* Contact Info Tooltip */}
                              {mainMember.email && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit max-w-full p-1 -ml-1 rounded-md hover:bg-muted">
                                        <Mail className="h-3 w-3 shrink-0" />
                                        <span className="truncate flex-1 max-w-35 sm:max-w-50 md:max-w-xs">{mainMember.email}</span>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{mainMember.email}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4 align-top">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-medium border-primary/20 bg-primary/5 text-primary">
                                {memberGroup.membershipType || 'Standard'}
                              </Badge>

                            </div>

                            {(memberGroup.billingAmount || memberGroup.billingCycle) && (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <CreditCard className="h-3.5 w-3.5 opacity-70" />
                                <span>
                                  {memberGroup.billingAmount ? `${memberGroup.billingAmount}` : '�'}
                                  {memberGroup.billingCycle ? ` / ${memberGroup.billingCycle}` : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>



                        <TableCell className="py-4 align-top">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
                              <span className="font-medium">
                                {memberGroup.startDate ? format(new Date(memberGroup.startDate), 'MMM d, yyyy') : 'N/A'}
                              </span>
                            </div>
                            <div className="h-4 w-px bg-border ml-1.5 opacity-50 my-0.5" />
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <RefreshCw className="h-3.5 w-3.5 opacity-50" />
                              <span>
                                {memberGroup.endDate ? format(new Date(memberGroup.endDate), 'MMM d, yyyy') : 'No Expiry'}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4 align-top text-left">
                          {getMembershipStatusBadge(memberGroup.startDate, memberGroup.endDate)}
                        </TableCell>

                        <TableCell className="py-4 align-top text-right pr-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel className="lg:hidden">Member Summary</DropdownMenuLabel>
                                <div className="px-2 py-1.5 space-y-1 text-xs text-muted-foreground lg:hidden">
                                  <p>Plan: {memberGroup.membershipType || 'Standard'}</p>
                                  <p>
                                    Billing: {memberGroup.billingAmount ? `?${memberGroup.billingAmount}` : '�'}
                                    {memberGroup.billingCycle ? ` / ${memberGroup.billingCycle}` : ''}
                                  </p>
                                  <p>Start: {memberGroup.startDate ? format(new Date(memberGroup.startDate), 'MMM d, yyyy') : 'N/A'}</p>
                                  <p>End: {memberGroup.endDate ? format(new Date(memberGroup.endDate), 'MMM d, yyyy') : 'No Expiry'}</p>
                                </div>
                                <DropdownMenuSeparator className="lg:hidden" />
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelectMember(memberGroup); }}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  disabled={!attendanceEligibility.isEligible || addAttendanceMutation.isPending}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (!attendanceEligibility.isEligible) {
                                      toast.error(attendanceEligibility.reason ?? 'Cannot add attendance for this member.')
                                      return
                                    }
                                    addAttendanceMutation.mutate(memberGroup)
                                  }}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {attendanceEligibility.isEligible ? 'Add Attendance' : 'Attendance Disabled'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setMemberToDelete(memberGroup)
                                    setDeleteConfirmOpen(true)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Member
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
                {filteredMembers.length > 0 && (
                  <TableFooter className="bg-muted/5">
                    <TableRow className="hover:bg-transparent border-t-0">
                      <TableCell colSpan={5} className="p-0">
                        <div className="flex flex-col items-center gap-2 p-4 sm:flex-row sm:justify-between w-full h-full text-foreground">
                          <div className="text-sm text-center text-muted-foreground sm:text-left">
                            Showing {Math.min(pageIndex * PAGE_SIZE + 1, filteredMembers.length)} to {Math.min((pageIndex + 1) * PAGE_SIZE, filteredMembers.length)} of {filteredMembers.length} entries
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
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              Page {pageIndex + 1} / {pageCount}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
                              disabled={pageIndex >= pageCount - 1 || pageCount === 0}
                              className="h-8 px-3 text-xs"
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </div>
          )}
        </CardContent>
      </div>

      <DeleteAdminConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={async () => {
          if (memberToDelete?.id) {
            await deleteMemberMutation.mutateAsync(memberToDelete.id)
            setMemberToDelete(null)
          }
        }}
        title={`Delete Member: ${memberToDelete?.members[0]?.name}`}
        description="Are you sure you want to delete this member?"
        confirmText="Delete Member"
      />
    </Card>
  )
}

export default memo(MembersTable)

