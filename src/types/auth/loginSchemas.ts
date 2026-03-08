import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Email or username is required.'),
  password: z.string().min(1, 'Password is required.'),
})

export type LoginPayload = z.infer<typeof loginSchema>

export const loginResponseSchema = z.string()

export type LoginResponse = z.infer<typeof loginResponseSchema>

export const apiResponseEnvelopeSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.unknown().optional(),
  errors: z.unknown().optional(),
  meta: z.unknown().optional(),
  timestamp: z.number().optional(),
})

export type ApiResponseEnvelope = z.infer<typeof apiResponseEnvelopeSchema>
