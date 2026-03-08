import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, ShieldCheck } from 'lucide-react'

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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { createUserFormSchema, createRoleFormSchema } from '@/types/user/userSchemas'
import type { CreateUserFormInput, CreateEmployeeLoginDialogProps } from '@/types/user/userSchemas'
import { AccessControlApi } from '@/api/generated/apis'
import { getAuthenticatedApi } from '@/lib/api-client'
import { accessControlQueryKeys } from '@/lib/QueryKeys'
import { InlineAddRoleForm } from './StaffAddRoles'
import type { RoleFormState } from './StaffAddRoles'
import { useAuthSession } from '@/lib/auth/auth-session'
import { useAllRoles } from '@/hooks/users/useAllRoles'




const accessControlApi = getAuthenticatedApi(AccessControlApi)



export function CreateEmployeeLoginDialog({
  open,
  onOpenChange,
  employeeName,
  onSubmit,
  isSubmitting,
  errorMessage,
}: CreateEmployeeLoginDialogProps) {
  const session = useAuthSession()
  const queryClient = useQueryClient()

  const [showNewRoleForm, setShowNewRoleForm] = useState(false)
  const [newRoleForm, setNewRoleForm] = useState<RoleFormState>({ name: '', description: '' })
  const [roleCreateError, setRoleCreateError] = useState<string | null>(null)

  const { data: roles = [], isLoading: rolesLoading } = useAllRoles()

  const form = useForm<CreateUserFormInput>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      username: '',
      password: '',
      roleIds: [],
    },
  })

  const createRoleMutation = useMutation({
    mutationFn: async () => {
      const parsed = createRoleFormSchema.parse(newRoleForm)
      if (!session.actorId) throw new Error('Missing actor ID for current user.')

      const response = await accessControlApi.createRole({
        rolePostDTO: {
          createdById: session.actorId,
          name: parsed.name,
          description: parsed.description,
        },
      })

      if (!response.success || !response.data) {
        throw new Error(response.message ?? 'Failed to create role.')
      }

      return response.data
    },
    onSuccess: (createdRole) => {
      setRoleCreateError(null)
      void queryClient.invalidateQueries({ queryKey: accessControlQueryKeys.roles })

      if (!createdRole.id) {
        setRoleCreateError('Role created but ID not returned')
        return
      }

      const currentRoles = form.getValues('roleIds') as string[]
      form.setValue('roleIds', [...currentRoles, createdRole.id])
      setNewRoleForm({ name: '', description: '' })
      setShowNewRoleForm(false)
    },
    onError: (error: unknown) => {
      setRoleCreateError(error instanceof Error ? error.message : 'Failed to create role.')
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setShowNewRoleForm(false)
      setNewRoleForm({ name: '', description: '' })
      setRoleCreateError(null)
    }
  }, [open, form])

  const handleSubmit = async (values: CreateUserFormInput) => {
    const parsed = createUserFormSchema.parse(values)
    await onSubmit(parsed)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Employee Login</DialogTitle>
          <DialogDescription>
            Create system login credentials for {employeeName}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="employee.username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="At least 8 characters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role selection */}
            <FormField
              control={form.control}
              name="roleIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    Assign Roles
                  </FormLabel>
                  {rolesLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading roles…
                    </div>
                  ) : roles.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">No roles available.</p>
                  ) : (
                    <>
                      <div className="rounded-md border divide-y">
                        {roles.map((role) => {
                          const checked = (field.value as string[]).includes(role.id)
                          return (
                            <label
                              key={role.id}
                              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(isChecked) => {
                                  const current = field.value as string[]
                                  field.onChange(
                                    isChecked
                                      ? [...current, role.id]
                                      : current.filter((id) => id !== role.id),
                                  )
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{role.name}</span>
                                  {checked && (
                                    <Badge variant="secondary" className="text-xs">Selected</Badge>
                                  )}
                                </div>
                                {role.description ? (
                                  <p className="text-xs text-muted-foreground truncate">{role.description}</p>
                                ) : null}
                              </div>
                            </label>
                          )
                        })}
                        
                        <button
                          type="button"
                          onClick={() => setShowNewRoleForm(true)}
                          className="flex items-center gap-2 px-3 py-2.5 w-full text-left hover:bg-muted/50 transition-colors text-primary font-medium text-sm"
                        >
                          <span className="flex items-center justify-center w-4 h-4 rounded-sm border-2 border-primary">
                            <span className="text-xs">+</span>
                          </span>
                          Create New Role
                        </button>
                      </div>
                      
                      {showNewRoleForm ? (
                        <InlineAddRoleForm
                          formState={newRoleForm}
                          setFormState={setNewRoleForm}
                          onCancel={() => {
                            setShowNewRoleForm(false)
                            setNewRoleForm({ name: '', description: '' })
                            setRoleCreateError(null)
                          }}
                          error={roleCreateError}
                        />
                      ) : null}
                      
                      {showNewRoleForm ? (
                        <div className="flex justify-end mt-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => void createRoleMutation.mutateAsync()}
                            disabled={!createRoleFormSchema.safeParse(newRoleForm).success || createRoleMutation.isPending}
                          >
                            {createRoleMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              'Add Role'
                            )}
                          </Button>
                        </div>
                      ) : null}
                    </>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create Login
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}