import { z } from 'zod'

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
  actorId: z.string().uuid().nullable().default(null),
  createdAt: z.string().datetime().nullable().default(null),
  email: z.string(),
  id: z.string().uuid(),
  updatedAt: z.string().datetime().nullable().default(null),
})

export type UserTable = z.infer<typeof userTableSchema>

export const apiResponseUserTableSchema = z.object({
  data: userTableSchema,
  errors: z.array(apiErrorSchema).nullable().default(null),
  message: z.string().optional(),
  meta: pageMetadataSchema.nullable().default(null),
  success: z.boolean(),
  timestamp: z.number().optional(),
})

export type ApiResponseUserTable = z.infer<typeof apiResponseUserTableSchema>

export const apiResponseListUserTableSchema = z.object({
  data: z.array(userTableSchema),
  errors: z.array(apiErrorSchema).nullable().default(null),
  message: z.string().optional(),
  meta: pageMetadataSchema.nullable().default(null),
  success: z.boolean(),
  timestamp: z.number().optional(),
})


export type JwtClaims = Record<string, unknown>


export type ApiResponseListUserTable = z.infer<typeof apiResponseListUserTableSchema>


// Schema for employee form (matches backend EmployeePostDTO/EmployeeTableDTO)
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

// Schema for the combined employee + user form (legacy, being deprecated)
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
})

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>
export type CreateUserFormInput = z.input<typeof createUserFormSchema>


