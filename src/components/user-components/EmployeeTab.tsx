import {
  FileText,
  Loader2,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
// TabsContent removed — this component no longer relies on tabs
import type { EmployeeTableDTO } from '@/api/generated/models'

export interface EmployeeTabProps {
  loadingEmployees: boolean
  filteredEmployees: EmployeeTableDTO[]
  normalizedSearch: string
  onEdit: (employee: EmployeeTableDTO) => void
  onDelete: (id: string) => void
}

export function EmployeeTab({
  loadingEmployees,
  filteredEmployees,
  normalizedSearch,
  onEdit,
}: EmployeeTabProps) {
  return (
    <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role / Status</TableHead>
              <TableHead className="w-24">Has Login</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingEmployees ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" /> Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {normalizedSearch
                    ? 'No matching employees found.'
                    : 'No employees found.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow
                  key={employee.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onEdit(employee)}
                >
                  <TableCell>
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.firstName}`}
                      />
                      <AvatarFallback>
                        {employee.firstName[0]}
                        {employee.surname[0]}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {employee.firstName} {employee.surname}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {employee.user?.email || 'No Email Linked'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{employee.contactNo}</TableCell>
                  <TableCell>
                    <Badge
                      variant={employee.status === 'IN' ? 'default' : 'secondary'}
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {employee.user && employee.user.email ? (
                      <Badge variant="secondary">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </TableCell>                  
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
  )
}