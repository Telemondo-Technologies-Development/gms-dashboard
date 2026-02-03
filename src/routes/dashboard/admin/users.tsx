import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Plus, RefreshCw, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { AddUserDialog } from '@/components/user-components/AddUserDialog'
import { EmployeeDialog } from '@/components/user-components/EmployeeDialog'
import { EmployeeTab } from '@/components/user-components/EmployeeTab'
import { UserTab } from '@/components/user-components/UserTab'

import { getAuthenticatedApi } from '@/lib/api-client'
import { EmployeeApi, UserApi } from '@/api/generated/apis'
import type {
  EmployeePostDTOStatusEnum,
  EmployeePutDTOStatusEnum,
  EmployeeTableDTO,
  UserTableDTO,
} from '@/api/generated/models'

import type { CreateUserFormValues, EmployeeFormValues } from '@/types/user/userSchemas'


export const Route = createFileRoute('/dashboard/admin/users')({
  component: UsersPage,
})



function UsersPage() {
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeTableDTO | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const queryClient = useQueryClient()
  const employeeApi = getAuthenticatedApi(EmployeeApi)
  const userApi = getAuthenticatedApi(UserApi)
  const employeeQueryKeys = ['employees']
  const userQueryKeys = ['users'] 

  const { 
    data: employees, 
    isLoading: loadingEmployees, 
    error: employeesError,
    refetch: refetchEmployees
  } = useQuery<EmployeeTableDTO[], Error>({
    queryKey: [employeeQueryKeys],
    queryFn: async () => {
      const response = await employeeApi.getAllEmployees({ pageable: {} })
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
  } = useQuery<UserTableDTO[], Error>({
    queryKey: [userQueryKeys],
    queryFn: async () => {
      const response = await userApi.getAllUsers({ pageable: {} })
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

  const handleEdit = (employee: EmployeeTableDTO) => {
    setSelectedEmployee(employee)
    setIsEmployeeDialogOpen(true)
  }

  const employeeMutation = useMutation({
    mutationFn: async (values: EmployeeFormValues) => {
      if (selectedEmployee) {
        await employeeApi.updateEmployee({
          id: selectedEmployee.id,
          employeePutDTO: {
            firstName: values.firstName,
            surname: values.surname,
            middleName: values.middleName,
            contactNo: values.contactNo,
            status: values.status as EmployeePutDTOStatusEnum,
            suffix: values.suffix,
            userId: values.userId,
            profilePictureId: values.profilePictureId,
          },
        })
      } else {
        await employeeApi.createEmployee({
          employeePostDTO: {
            firstName: values.firstName,
            surname: values.surname,
            middleName: values.middleName,
            contactNo: values.contactNo,
            status: values.status as EmployeePostDTOStatusEnum,
            suffix: values.suffix,
            userId: values.userId,
            profilePictureId: values.profilePictureId,
          },
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [employeeQueryKeys] })
      setIsEmployeeDialogOpen(false)
      setSelectedEmployee(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await employeeApi.deleteEmployee({ id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [employeeQueryKeys] })
    },
  })

  const userMutation = useMutation({
    mutationFn: async (values: CreateUserFormValues) => {
      await userApi.createUser({
        userPostDTO: {
          email: values.email,
          password: values.password,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [userQueryKeys] })
      setIsUserDialogOpen(false)
    },
  })

  const normalizedSearch = useMemo(() => searchTerm.trim().toLowerCase(), [searchTerm])

  const filteredEmployees = useMemo(() => {
    const list = employees ?? []
    if (!normalizedSearch) return list
    return list.filter((employee) => {
      const name = `${employee.firstName} ${employee.surname}`.toLowerCase()
      const email = employee.user?.email?.toLowerCase() ?? ''
      const contact = employee.contactNo?.toLowerCase() ?? ''
      const status = employee.status?.toLowerCase() ?? ''
      return (
        name.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        contact.includes(normalizedSearch) ||
        status.includes(normalizedSearch)
      )
    })
  }, [employees, normalizedSearch])

  const filteredUsers = useMemo(() => {
    const list = users ?? []
    if (!normalizedSearch) return list
    return list.filter((user) => {
      const email = user.email?.toLowerCase() ?? ''
      const id = user.id?.toLowerCase() ?? ''
      const actorId = user.actorId?.toLowerCase() ?? ''
      return (
        email.includes(normalizedSearch) ||
        id.includes(normalizedSearch) ||
        actorId.includes(normalizedSearch)
      )
    })
  }, [users, normalizedSearch])

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
  }

  return (
    <div className="space-y-4">
      {(employeesError || usersError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load data</AlertTitle>
          <AlertDescription>
            {(employeesError?.message ?? usersError?.message) ||
              'Something went wrong.'}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="employees" className="space-y-4">
        <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-3">
          <div className="relative w-full md:justify-self-start">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search employees or users..."
              className="pl-9 rounded-2xl"
            />
          </div>

          <div className="w-full md:w-auto md:justify-self-center">
            <TabsList className="grid w-full grid-cols-2 bg-muted/60 p-1 md:w-90">
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="users">System Users</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex w-full justify-end gap-2 md:w-auto md:justify-self-end">
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedEmployee(null)
                setIsEmployeeDialogOpen(true)
              }}
            >
              <Plus className=" h-4 w-4" />  Employee
            </Button>
            <Button onClick={() => setIsUserDialogOpen(true)}>
              <Plus className=" h-4 w-4" />  User
            </Button>
          </div>
        </div>

        <EmployeeTab
          loadingEmployees={loadingEmployees}
          filteredEmployees={filteredEmployees}
          normalizedSearch={normalizedSearch}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <UserTab
          loadingUsers={loadingUsers}
          filteredUsers={filteredUsers}
          employees={employees}
          normalizedSearch={normalizedSearch}
        />
      </Tabs>

      <EmployeeDialog
        open={isEmployeeDialogOpen}
        onOpenChange={(open) => {
          setIsEmployeeDialogOpen(open)
          if (!open) setSelectedEmployee(null)
        }}
        employee={selectedEmployee}
        onSubmit={employeeMutation.mutateAsync}
      />

      <AddUserDialog
        open={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        onSubmit={userMutation.mutateAsync}
      />
    </div>
  )
}