import { useState } from 'react'

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
  Trash2
} from 'lucide-react'

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

export interface EmployeeTabProps {
  loadingEmployees: boolean
  filteredEmployees: EmployeeTableDTO[]
  normalizedSearch: string
  onEdit: (employee: EmployeeTableDTO) => void
  onDelete: (id: string) => void
  onAddLogin: (employee: EmployeeTableDTO) => void
  onAddPermission: (employee: EmployeeTableDTO) => void
}

function getInitials(firstName: string, surname: string) {
  return (firstName[0] + surname[0]).toUpperCase()
}

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

  return (
    <>
    <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-b border-muted/60">
              <TableHead className="w-[30%] pl-6">Employee</TableHead>
              <TableHead className="w-[25%] ">Contact Details</TableHead>
              <TableHead className="w-[20%]">Role & Access</TableHead>
              <TableHead className="w-[15%] ">Status</TableHead>
              <TableHead className="w-[10%] pl-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingEmployees ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" /> 
                    <span>Loading employees...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
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
              filteredEmployees.map((employee) => (
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
                      {employee.user?.email ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors w-fit p-1 -ml-1 rounded-md hover:bg-muted">
                                <Mail className="h-3.5 w-3.5 shrink-0 opacity-70" />
                                <span className="truncate max-w-[150px]">{employee.user.email}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{employee.user.email}</p>
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
                  
                  <TableCell className="py-4 align-top">
                    <div className="flex flex-col items-start gap-2">
                      <div className="flex items-center gap-1.5">
                        {employee.user ? (
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
                      
                      {/* Placeholder for future role display if available in DTO */}
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