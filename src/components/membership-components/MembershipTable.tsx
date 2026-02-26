import { useMemo, useState, useCallback, memo } from 'react'
import { format } from 'date-fns'
import { Search, Calendar, RefreshCw, Loader2, User, Mail, Phone, CreditCard, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useMembersData } from '@/hooks/membership/useMembership'
import { AddMemberDialog } from '@/components/membership-components/MembershipAddFormDialog'
import { DeleteAdminConfirmDialog } from '@/components/common/DeleteAdminConfirm'
import { getAuthenticatedApi } from '@/lib/api-client'
import { useAuthSession } from '@/lib/auth/auth-session'
import { useSelectedBranchId } from '@/hooks/useSelectedBranchId'
import { MemberApi } from '@/api/generated/apis/MemberApi'
import { AttendanceApi } from '@/api/generated/apis/AttendanceApi'
import { AttendancePostDTOSourceEnum, AttendancePostDTOTypeEnum } from '@/api/generated/models/AttendancePostDTO'
import { memberQueryKeys } from '@/lib/QueryKeys'
import type { MemberFormData } from '@/types/membership/memberSchemas'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<MemberFormData | null>(null)

  const { enrichedMembers, isFetching, error, refetchAll } = useMembersData()
  const session = useAuthSession()
  const selectedBranchId = useSelectedBranchId()
  const queryClient = useQueryClient()

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
          source: AttendancePostDTOSourceEnum.Manual,
          type: AttendancePostDTOTypeEnum.In,
        },
      })

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
          <Badge variant="default" className="px-3 py-1 text-sm">
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
                    <TableHead className="w-[30%] pl-6 py-4 font-semibold text-foreground/70">Member Details</TableHead>
                    <TableHead className="w-[25%] py-4 font-semibold text-foreground/70">Plan & Billing</TableHead>
                    <TableHead className="w-[25%] py-4 font-semibold text-foreground/70">Subscription Period</TableHead>
                    <TableHead className="w-[10%] py-4 font-semibold text-foreground/70 text-right">Status</TableHead>
                    <TableHead className="w-[10%] py-4 font-semibold text-foreground/70 text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((memberGroup) => {
                    const mainMember = memberGroup.members[0]
                    const otherMembersCount = Math.max(0, memberGroup.members.length - 1)
                    
                    return (
                      <TableRow
                        key={memberGroup.id}
                        className="cursor-pointer hover:bg-muted/40 transition-colors group border-b border-muted/40"
                        role="button"
                        tabIndex={0}
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
                              <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {memberGroup.members[0]?.name || 'Unknown Member'}
                              </span>
                              
                              
                              {/* Contact Info Tooltip */}
                              {mainMember.email && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit p-1 -ml-1 rounded-md hover:bg-muted">
                                        <Mail className="h-3 w-3" />
                                        <span className="truncate max-w-[150px]">{mainMember.email}</span>
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
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                              <span className="font-medium">
                                {memberGroup.startDate ? format(new Date(memberGroup.startDate), 'MMM d, yyyy') : 'N/A'}
                              </span>
                            </div>
                            <div className="h-4 w-[1px] bg-border ml-1.5 opacity-50 my-0.5" />
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <RefreshCw className="h-3.5 w-3.5 opacity-50" />
                              <span>
                                {memberGroup.endDate ? format(new Date(memberGroup.endDate), 'MMM d, yyyy') : 'No Expiry'}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4 align-top text-right pr-6">
                          {getMembershipStatusBadge(memberGroup.endDate)}
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
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelectMember(memberGroup); }}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    addAttendanceMutation.mutate(memberGroup)
                                  }}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Add Attendance
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

      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
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
    </Card>
  )
}

export default memo(MembersTable)
