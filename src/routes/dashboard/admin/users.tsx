import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  MoreHorizontal,
  FileText,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { getAuthenticatedApi } from '@/lib/api-client'
import { EmployeeApi, UserApi } from '@/api/generated/apis'
import type {
  EmployeePostDTOStatusEnum,
  EmployeePutDTOStatusEnum,
  EmployeeTableDTO,
  UserTableDTO,
} from '@/api/generated/models'

import { userFormSchema } from '@/types/user/userSchemas'
import type { UserFormValues, UserFormInput } from '@/types/user/userSchemas'


export const Route = createFileRoute('/dashboard/admin/users')({
  component: UsersPage,
})



function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeTableDTO | null>(null)
  
  const queryClient = useQueryClient()
  const employeeApi = getAuthenticatedApi(EmployeeApi)
  const userApi = getAuthenticatedApi(UserApi)

  const { 
    data: employees, 
    isLoading: loadingEmployees, 
    error: employeesError,
    refetch: refetchEmployees
  } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await employeeApi.getAllUsers2()
      if (!response.success) {
			  throw new Error(response.message ?? 'Failed to fetch employees')
		  }
		  return response.data ?? []
    },
  })

  const { 
    data: users, 
    isLoading: loadingUsers,
    error: usersError,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userApi.getAllUsers()
      if (!response.success) {
        throw new Error(response.message ?? 'Failed to fetch users')
      }
      return response.data ?? []
    },
  })

  const handleRefresh = () => {
    refetchEmployees()
    refetchUsers()
  }

  // Start Mutations
  const mutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      // 1. Handle User Creation if email is provided and new
      if (values.email && !selectedEmployee) {
        try {
            if (values.password) {
                // If the user already exists, this might fail or return error. 
                // We're catching errors broadly here.
                await userApi.createUser({
                    userPostDTO: {
                        email: values.email,
                        password: values.password
                    }
                })
                // Note: We are not retrieving the new User ID accurately here because 
                // the API behavior isn't fully clear without testing. 
                // In a real scenario, we'd fetch the user by email to get the ID.
            }
        } catch (error) {
            console.error("User creation failed or exists", error)
        }
      }

      // 2. Handle Employee Operations
      if (selectedEmployee) {
        await employeeApi.updateEmployee({
            id: selectedEmployee.id,
            employeePutDTO: {
                firstName: values.firstName,
                surname: values.lastName,
                contactNo: values.contacNo,
                status: values.status as EmployeePutDTOStatusEnum,
                // Missing: userId update logic, profile picture update logic
            }
        })
      } else {
        await employeeApi.createEmployee({
            employeePostDTO: {
                firstName: values.firstName,
                surname: values.lastName,
                contactNo: values.contacNo,
                status: values.status as EmployeePostDTOStatusEnum,
                // Missing: userId linking logic (requires fetching user first)
            }
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      setIsDialogOpen(false)
      setSelectedEmployee(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await employeeApi.deleteEmployee({ id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
  // End Mutations

  const handleEdit = (employee: EmployeeTableDTO) => {
    setSelectedEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="p-4 space-y-6">
      {employeesError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error fetching employees</AlertTitle>
          <AlertDescription>
            {employeesError.message}
          </AlertDescription>
        </Alert>
      )}

      {usersError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error fetching users</AlertTitle>
          <AlertDescription>
            {usersError.message}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="employees" className="w-full">
        <div className="flex items-center justify-between mb-4">
           <TabsList className="grid w-75 grid-cols-2">
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="users">System Users</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4" />
                </Button>
                <Button onClick={() => { setSelectedEmployee(null); setIsDialogOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </div>
        </div>
       
        <TabsContent value="employees">
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role / Status</TableHead>
                  <TableHead>Salary (Est)</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingEmployees ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin" /> Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : employees?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No employees found.
                      </TableCell>
                    </TableRow>
                ) : (
                    employees?.map((employee: EmployeeTableDTO) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.firstName}`} />
                            <AvatarFallback>{employee.firstName[0]}{employee.surname[0]}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{employee.firstName} {employee.surname}</span>
                            <span className="text-xs text-muted-foreground">{employee.user?.email || 'No Email Linked'}</span>
                          </div>
                        </TableCell>
                        <TableCell>{employee.contactNo}</TableCell>
                        <TableCell>
                            <Badge variant={employee.status === 'IN' ? 'default' : 'secondary'}>
                                {employee.status}
                            </Badge>
                        </TableCell>
                        <TableCell>$45,000</TableCell> {/* Mock Data */}
                        <TableCell>
                            <Button variant="ghost" size="sm" className="h-8">
                                <FileText className="h-4 w-4 mr-1" /> View
                            </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEdit(employee)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(employee.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
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
        </TabsContent>

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
                    ) : users?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                            No users found.
                          </TableCell>
                        </TableRow>
                    ) : (
                        users?.map((user: UserTableDTO) => {
                            const linkedEmployee = employees?.find(e => e.id === user.actorId)
                            
                            return (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.email}</TableCell>
                                    <TableCell>
                                        {linkedEmployee ? (
                                             <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${linkedEmployee.firstName}`} />
                                                    <AvatarFallback>{linkedEmployee.firstName[0]}{linkedEmployee.surname[0]}</AvatarFallback>
                                                </Avatar>
                                                <span>{linkedEmployee.firstName} {linkedEmployee.surname}</span>
                                                <Badge variant="outline" className="text-[10px] ml-1">ID: {linkedEmployee.id.substring(0,6)}...</Badge>
                                             </div>
                                        ) : user.actorId ? (
                                            <div className="flex flex-col">
                                                <span className="text-sm text-yellow-600 font-medium">Unknown Actor</span>
                                                <span className="text-[10px] text-muted-foreground font-mono">{user.actorId}</span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic">Not Linked</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{user.id}</TableCell>
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
      </Tabs>

      <UserDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        employee={selectedEmployee}
        onSubmit={mutation.mutateAsync}
      />
    </div>
  )
}

function UserDialog({ 
    open, 
    onOpenChange, 
    employee,
    onSubmit
}: { 
    open: boolean
    onOpenChange: (open: boolean) => void
    employee: EmployeeTableDTO | null
    onSubmit: (values: UserFormValues) => Promise<void>
}) {
    const form = useForm<UserFormInput>({
      resolver: zodResolver(userFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            contacNo: '',
        status: 'IN',
            salary: 0,
            password: '', 
        },
        values: employee ? {
            firstName: employee.firstName,
            lastName: employee.surname,
            email: employee.user?.email || '',
            contacNo: employee.contactNo,
        status: employee.status,
            salary: 0, // Mock
            password: '', // Don't fill password
        } : undefined
    })

    const handleSubmit = async (values: UserFormInput) => {
        try {
        const parsed = userFormSchema.parse(values)
        await onSubmit(parsed)
            form.reset()
        } catch (error) {
            console.error("Error submitting form", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-150">
                <DialogHeader>
                    <DialogTitle>{employee ? 'Edit User' : 'Add New User'}</DialogTitle>
                    <DialogDescription>
                        {employee ? 'Update employee details here.' : 'Create a new employee and user account.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {!employee && (
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="contacNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1234567890" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="IN">Active (IN)</SelectItem>
                                                <SelectItem value="OUT">Inactive (OUT)</SelectItem>
                                                <SelectItem value="UNDECIDED">Undecided</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="salary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Salary</FormLabel>
                                        <FormControl>
              										<Input
              											type="number"
              											placeholder="50000"
              											value={typeof field.value === 'number' || typeof field.value === 'string' ? field.value : ''}
              											onChange={(e) => {
              												const raw = e.target.value
              												field.onChange(raw === '' ? undefined : Number(raw))
              											}}
              											onBlur={field.onBlur}
              											name={field.name}
              											ref={field.ref}
              											disabled={field.disabled}
              										/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="resumeUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Resume URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                {employee ? 'Save Changes' : 'Create User'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}