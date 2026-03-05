import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
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
import { createUserFormSchema } from '@/types/user/userSchemas'
import type { CreateUserFormInput, CreateUserFormValues } from '@/types/user/userSchemas'
import { AccessControlApi } from '@/api/generated/apis'
import { getAuthenticatedApi } from '@/lib/api-client'

interface CreateEmployeeLoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeName: string
  onSubmit: (values: CreateUserFormValues) => Promise<void>
  isSubmitting: boolean
  errorMessage?: string | null
}

export function CreateEmployeeLoginDialog({
  open,
  onOpenChange,
  employeeName,
  onSubmit,
  isSubmitting,
  errorMessage,
}: CreateEmployeeLoginDialogProps) {
  const accessControlApi = getAuthenticatedApi(AccessControlApi)

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ['auth-roles'],
    queryFn: async () => {
      const response = await accessControlApi.getAllRoles({
        pageable: { page: 0, size: 1000 },
      })
      if (response.success && Array.isArray(response.data)) {
        return response.data as Array<{ id: string; name: string; description?: string }>
      }
      return []
    },
    staleTime: 5 * 60 * 1000,
  })

  const roles = rolesData ?? []

  const form = useForm<CreateUserFormInput>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      username: '',
      password: '',
      roleIds: [],
    },
  })

  useEffect(() => {
    if (!open) form.reset()
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
                    </div>
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