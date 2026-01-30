import { Loader2 } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TabsContent } from '@/components/ui/tabs'
import type { EmployeeTableDTO, UserTableDTO } from '@/api/generated/models'

export interface UserTabProps {
  loadingUsers: boolean
  filteredUsers: UserTableDTO[]
  employees: EmployeeTableDTO[] | undefined
  normalizedSearch: string
}

export function UserTab({
  loadingUsers,
  filteredUsers,
  employees,
  normalizedSearch,
}: UserTabProps) {
  return (
    <TabsContent value="users">
      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>
            Registered users who can log in to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Linked Employee</TableHead>
                  <TableHead>User ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingUsers ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin" /> Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      {normalizedSearch ? 'No matching users found.' : 'No users found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const linkedEmployee = employees?.find((e) => e.id === user.actorId)

                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          {linkedEmployee ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${linkedEmployee.firstName}`}
                                />
                                <AvatarFallback>
                                  {linkedEmployee.firstName[0]}
                                  {linkedEmployee.surname[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                {linkedEmployee.firstName} {linkedEmployee.surname}
                              </span>
                              <Badge variant="outline" className="text-[10px] ml-1">
                                ID: {linkedEmployee.id.substring(0, 6)}...
                              </Badge>
                            </div>
                          ) : user.actorId ? (
                            <div className="flex flex-col">
                              <span className="text-sm text-yellow-600 font-medium">
                                Unknown Actor
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {user.actorId}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Not Linked</span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {user.id}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}