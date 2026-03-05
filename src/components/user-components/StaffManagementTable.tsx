import { useState, useMemo, useEffect } from 'react'

import {
  Loader2,
  Mail,
  User,
  ShieldCheck,
  Phone,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Pencil,
  UserPlus,
  ShieldPlus,
  Trash2,
  Building2,
  Tag,
} from 'lucide-react'

import { useQuery } from '@tanstack/react-query'
import { getAuthenticatedApi } from '@/lib/api-client'
import { BranchPersonnelApi, BranchPersonnelRolesApi } from '@/api/generated/apis'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DeleteAdminConfirmDialog } from '@/components/common/DeleteAdminConfirm'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// TabsContent removed — this component no longer relies on tabs
import type { EmployeeTableDTO } from '@/api/generated/models'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import  type { EmployeeTabProps } from '@/types/user/userSchemas'

const personnelApi = getAuthenticatedApi(BranchPersonnelApi)
const personnelRolesApi = getAuthenticatedApi(BranchPersonnelRolesApi)


export function EmployeeTab({
  loadingEmployees,
  filteredEmployees,
  normalizedSearch,
  onEdit,
  onDelete,
  onAddLogin,
  onAddPermission,
}: EmployeeTabProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeTableDTO | null>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const PAGE_SIZE = 5

  // Fetch all branch personnel → actorId → personnelRoleId map
  const { data: allPersonnel } = useQuery({
    queryKey: ['branch-personnel-all'],
    queryFn: () => personnelApi.getAllBranchPersonnel({ pageable: { page: 0, size: 1000 } }).then((r) => r.data ?? []),
    staleTime: 60_000,
  })

  // Fetch all personnel roles → id → name map
  const { data: allRoles } = useQuery({
    queryKey: ['personnel-roles-all'],
    queryFn: () => personnelRolesApi.getAllPersonnelRoles({ pageable: { page: 0, size: 200 } }).then((r) => r.data ?? []),
    staleTime: 5 * 60_000,
  })

  const roleById = useMemo(() => {
    const map = new Map<string, string>()
    for (const r of allRoles ?? []) map.set(r.id, r.name)
    return map
  }, [allRoles])

  const roleByActorId = useMemo(() => {
    const map = new Map<string, string>()
    for (const p of allPersonnel ?? []) {
      if (!p.actorId || !p.personnelRoleId) continue
      const roleName = roleById.get(p.personnelRoleId)
      if (roleName) map.set(p.actorId, roleName)
    }
    return map
  }, [allPersonnel, roleById])

  const pageCount = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE))

  const pageItems = useMemo(() => {
    const start = pageIndex * PAGE_SIZE
    return filteredEmployees.slice(start, start + PAGE_SIZE)
  }, [filteredEmployees, pageIndex])

  // Reset to first page whenever the filtered list changes (e.g. search)
  useEffect(() => {
    setPageIndex(0)
  }, [filteredEmployees])

  return (
    <>
    <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-b border-muted/60">
              <TableHead className="w-[25%] pl-6">Employee</TableHead>
              <TableHead className="w-[20%]">Contact Details</TableHead>
              <TableHead className="w-[20%]">Branch</TableHead>
              <TableHead className="w-[15%]">Role & Access</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[10%] text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingEmployees ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" /> 
                    <span>Loading employees...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No employees found</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                      {normalizedSearch
                        ? `No results matching "${normalizedSearch}"`
                        : 'Your employee list is currently empty.'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((employee) => (
                <TableRow
                  key={employee.id}
                  className="cursor-pointer hover:bg-muted/40 transition-colors group border-b border-muted/40"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onEdit(employee)
                    }
                  }}
                >
                  <TableCell className="pl-6 py-4 align-top">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {employee.firstName} {employee.surname}
                        </span>
                        {/* Position field not in DTO yet, temporarily removed */}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 align-top">
                    <div className="flex flex-col gap-1.5 text-sm">
                      {employee.username ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors w-fit p-1 -ml-1 rounded-md hover:bg-muted">
                                <Mail className="h-3.5 w-3.5 shrink-0 opacity-70" />
                                <span className="truncate max-w-37.5">{employee.username}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{employee.username}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground/60 italic p-1 -ml-1">
                          <Mail className="h-3.5 w-3.5 shrink-0 opacity-40" />
                          <span>No username linked</span>
                        </div>
                      )}
                      
                      {employee.contactNo && (
                        <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors w-fit p-1 -ml-1 rounded-md hover:bg-muted">
                          <Phone className="h-3.5 w-3.5 shrink-0 opacity-70" />
                          <span>{employee.contactNo}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  {/* Branch column */}
                  <TableCell className="py-4 align-top">
                    <div className="flex flex-col gap-1">
                      {employee.branches.length > 0 ? (
                        employee.branches.map((branch) => (
                          <div key={branch.id} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5 shrink-0 opacity-70" />
                            <span className="truncate max-w-36">{branch.name}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground/60 italic">No branch assigned</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Role & Access column */}
                  <TableCell className="py-4 align-top">
                    <div className="flex flex-col items-start gap-2">
                      {employee.actorId && roleByActorId.get(employee.actorId) ? (
                        <div className="flex items-center gap-1.5 text-sm">
                          <Tag className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="font-medium text-foreground">{roleByActorId.get(employee.actorId)}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/60 italic">No role</span>
                      )}
                      {employee.userId ? (
                        <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-700 hover:bg-green-500/20 hover:text-green-800 border-green-200">
                          <ShieldCheck className="h-3 w-3" />
                          Has Login
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 bg-muted text-muted-foreground hover:bg-muted-foreground/10 border-muted-foreground/20">
                          No Login
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4 align-top text-left">
                    <div className="flex ">
                      {employee.status === 'IN' ? (
                        <Badge className="gap-1 bg-green-500 hover:bg-green-600 border-transparent">
                           <CheckCircle2 className="h-3 w-3" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1 text-muted-foreground">
                           <XCircle className="h-3 w-3" /> Inactive
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="py-4 align-top pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={(event) => {
                          event.stopPropagation()
                          onEdit(employee)
                        }}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation()
                            onAddLogin(employee)
                          }}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add Login
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation()
                            onAddPermission(employee)
                          }}
                        >
                          <ShieldPlus className="mr-2 h-4 w-4" />
                          Add Permission
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={(event) => {
                            event.stopPropagation()
                            setEmployeeToDelete(employee)
                            setDeleteConfirmOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {filteredEmployees.length > 0 && (
            <TableFooter className="bg-muted/5">
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="p-0">
                  <div className="flex flex-col items-center gap-2 px-6 py-3 sm:flex-row sm:justify-between w-full h-full">
                    <p className="text-sm text-muted-foreground text-center sm:text-left">
                      Showing{' '}
                      {Math.min(pageIndex * PAGE_SIZE + 1, filteredEmployees.length)}
                      {' '}to{' '}
                      {Math.min((pageIndex + 1) * PAGE_SIZE, filteredEmployees.length)}
                      {' '}of {filteredEmployees.length}{' '}
                      {filteredEmployees.length === 1 ? 'employee' : 'employees'}
                    </p>
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
                        Page {pageIndex + 1} of {pageCount}
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
          )}
        </Table>
      </div>

      <DeleteAdminConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={async () => {
          if (employeeToDelete?.id) {
            await onDelete(employeeToDelete.id)
            setEmployeeToDelete(null)
          }
        }}
        title={`Delete Employee: ${employeeToDelete?.firstName} ${employeeToDelete?.surname}`}
        description="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Delete Employee"
      />
    </>
  )
}