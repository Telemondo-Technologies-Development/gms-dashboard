import { z } from 'zod'

export const apiErrorSchema = z.object({
  code: z.string().optional(),
  description: z.string().optional(),
})

export const pageMetadataSchema = z.object({
  pageCount: z.number().optional(),
  pageIndex: z.number().optional(),
  pageSize: z.number().optional(),
  totalCount: z.number().optional(),
})

export const userTableSchema = z.object({
  actorId: z.string().uuid().nullable().optional().transform((v) => v ?? undefined),
  email: z.string(),
  id: z.string().uuid(),
})

export type UserTable = z.infer<typeof userTableSchema>

export const apiResponseUserTableSchema = z.object({
  data: userTableSchema,
  errors: z.array(apiErrorSchema).nullable().optional().transform((v) => v ?? undefined),
  message: z.string().optional(),
  meta: pageMetadataSchema.nullable().optional().transform((v) => v ?? undefined),
  success: z.boolean(),
  timestamp: z.number().optional(),
})

export type ApiResponseUserTable = z.infer<typeof apiResponseUserTableSchema>

export const apiResponseListUserTableSchema = z.object({
  data: z.array(userTableSchema),
  errors: z.array(apiErrorSchema).nullable().optional().transform((v) => v ?? undefined),
  message: z.string().optional(),
  meta: pageMetadataSchema.nullable().optional().transform((v) => v ?? undefined),
  success: z.boolean(),
  timestamp: z.number().optional(),
})


export type JwtClaims = Record<string, unknown>


export type ApiResponseListUserTable = z.infer<typeof apiResponseListUserTableSchema>


// Schema for the form
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