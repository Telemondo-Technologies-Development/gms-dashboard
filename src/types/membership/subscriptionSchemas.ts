import { z } from 'zod'

const apiErrorSchema = z
  .object({
    message: z.string().optional(),
  })
  .passthrough()

export const subscriptionIntervalsSchema = z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])

export const billingCycleTableDTOSchema = z.object({
  gracePeriodDays: z.coerce.number(),
  id: z.string(),
  intervalCount: z.coerce.number(),
  intervals: subscriptionIntervalsSchema,
  name: z.string(),
})

export type BillingCycleTableDTOParsed = z.infer<typeof billingCycleTableDTOSchema>

export const apiResponseListBillingCycleTableDTOSchema = z.object({
  data: z.array(billingCycleTableDTOSchema).optional(),
  errors: z.array(apiErrorSchema).optional(),
  message: z.string().optional(),
  meta: z.unknown().optional(),
  success: z.boolean(),
  timestamp: z.coerce.number(),
})

export const subscriptionPostSchema = z.object({
  amount: z.coerce.number().positive(),
  billingCycleId: z.string().min(1),
  createdById: z.string().min(1),
  description: z.string().min(1),
  name: z.string().min(1),
})

export type SubscriptionPostInput = z.infer<typeof subscriptionPostSchema>

const coerceDate = z.preprocess((value) => {
  if (value instanceof Date) return value
  return new Date(String(value))
}, z.date())

export const subscriptionTableDTOSchema = z.object({
  amount: z.coerce.number(),
  billingCycleId: z.string(),
  createdAt: coerceDate,
  createdById: z.string().optional(),
  description: z.string(),
  id: z.string(),
  name: z.string(),
  updatedAt: coerceDate,
  updatedById: z.string().optional(),
})

export const apiResponseSubscriptionTableDTOSchema = z.object({
  data: subscriptionTableDTOSchema.optional(),
  errors: z.array(apiErrorSchema).optional(),
  message: z.string().optional(),
  meta: z.unknown().optional(),
  success: z.boolean(),
  timestamp: z.coerce.number(),
})

export const subscriptionAvailedPostSchema = z.object({
  subscriptionId: z.string().min(1),
})

export const subscriptionAvailedTableDTOSchema = z.object({
  amount: z.coerce.number(),
  gracePeriodDays: z.coerce.number(),
  id: z.string(),
  intervalCount: z.coerce.number(),
  intervals: subscriptionIntervalsSchema,
  name: z.string(),
})

export type SubscriptionAvailedTableDTOParsed = z.infer<typeof subscriptionAvailedTableDTOSchema>

export const apiResponseSubscriptionAvailedTableDTOSchema = z.object({
  data: subscriptionAvailedTableDTOSchema.optional(),
  errors: z.array(apiErrorSchema).optional(),
  message: z.string().optional(),
  meta: z.unknown().optional(),
  success: z.boolean(),
  timestamp: z.coerce.number(),
})

export interface UseCreateSubscriptionPlanOptions {
  createdById: string | null
  onCreated?: (plan: SubscriptionAvailedTableDTOParsed) => void
}

export interface UseCreateSubscriptionPlanResult {
  formState: SubscriptionPlanFormState
  setFormState: React.Dispatch<React.SetStateAction<SubscriptionPlanFormState>>
  submitError: string | null
  isSubmitting: boolean
  handleSubmit: () => Promise<void>
  reset: () => void
}

export interface SubscriptionPlanFormState {
  name: string
  description: string
  amount: string
  billingCycleId: string
}