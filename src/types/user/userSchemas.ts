import { z } from 'zod'
import type { EmployeeTableDTO } from '@/api/generated/models'


export const apiErrorSchema = z.object({
  code: z.string().optional(),
  description: z.string().optional(),
  field: z.string().optional(),
})

export const pageMetadataSchema = z.object({
  pageCount: z.number().optional(),
  pageIndex: z.number().optional(),
  pageSize: z.number().optional(),
  totalCount: z.number().optional(),
})

export const userTableSchema = z.object({
  actorId: z.string().uuid().optional(),
  createdAt: z.string().datetime().optional(),
  email: z.string(),
  id: z.string().uuid(),
  updatedAt: z.string().datetime().optional(),
})

export type UserTable = z.infer<typeof userTableSchema>

export const apiResponseUserTableSchema = z.object({
  data: userTableSchema,
  errors: z.array(apiErrorSchema).optional(),
  message: z.string().optional(),
  meta: pageMetadataSchema.optional(),
  success: z.boolean(),
  timestamp: z.number().optional(),
})

export type ApiResponseUserTable = z.infer<typeof apiResponseUserTableSchema>

export const apiResponseListUserTableSchema = z.object({
  data: z.array(userTableSchema),
  errors: z.array(apiErrorSchema).optional(),
  message: z.string().optional(),
  meta: pageMetadataSchema.optional(),
  success: z.boolean(),
  timestamp: z.number().optional(),
})


export type JwtClaims = Record<string, unknown>


export type ApiResponseListUserTable = z.infer<typeof apiResponseListUserTableSchema>

export function parseUserResponse(json: unknown): UserTable {
  const parsed = apiResponseUserTableSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error('Failed to validate user response.')
  }

  if (!parsed.data.success) {
    throw new Error(parsed.data.message ?? 'Failed to fetch user.')
  }

  return parsed.data.data
}

export function parseUsersResponse(json: unknown): UserTable[] {
  const parsed = apiResponseListUserTableSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error('Failed to validate users response.')
  }

  if (!parsed.data.success) {
    throw new Error(parsed.data.message ?? 'Failed to fetch users.')
  }

  return parsed.data.data
}


export const employeeFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Surname is required'),
  middleName: z.string().optional(),
  contactNo: z.string().min(1, 'Contact number is required'),
  status: z.enum(['IN', 'OUT', 'UNDECIDED']),
  suffix: z.string().optional(),
  userId: z.string().uuid().optional(),
  profilePictureId: z.string().uuid().optional(),
})

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>
export type EmployeeFormInput = z.input<typeof employeeFormSchema>
export const userFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  contacNo: z.string().min(1, 'Phone number is required'),
  salary: z.coerce.number().min(0).optional(),
  resumeUrl: z.string().optional(),
  // profilePictureUrl: z.string().optional(),
  status: z.enum(['IN', 'OUT', 'UNDECIDED']),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
})

export type UserFormValues = z.infer<typeof userFormSchema>
export type UserFormInput = z.input<typeof userFormSchema>

// Schema for creating a system user (matches UserPostDTO requirements)
export const createUserFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roleIds: z.array(z.string().uuid()).default([]),
})

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>
export type CreateUserFormInput = z.input<typeof createUserFormSchema>


export interface EmployeeTabProps {
  loadingEmployees: boolean
  filteredEmployees: EmployeeTableDTO[]
  normalizedSearch: string
  onEdit: (employee: EmployeeTableDTO) => void
  onDelete: (id: string) => void
  onAddLogin: (employee: EmployeeTableDTO) => void
  onAddPermission: (employee: EmployeeTableDTO) => void
}

export const createRoleFormSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().min(1, 'Description is required'),
})
// ---------------------------------------------------------------------------
// Module-level API client
// ---------------------------------------------------------------------------
export interface CreateEmployeeLoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeName: string
  onSubmit: (values: CreateUserFormValues) => Promise<void>
  isSubmitting: boolean
  errorMessage?: string | null
}