import { z } from 'zod'

export const currencyCodeSchema = z.string().min(3).max(3).default('PHP')

export const paymentCycleSchema = z.enum(['one-time', 'monthly', 'quarterly', 'yearly'])
export type PaymentCycle = z.infer<typeof paymentCycleSchema>

export const paymentStatusSchema = z.enum(['paid', 'failed', 'upcoming', 'overdue'])
export type PaymentStatus = z.infer<typeof paymentStatusSchema>

export const paymentMethodSchema = z.enum(['credit-card', 'bank-transfer', 'gcash', 'cash']).optional()
export type PaymentMethod = z.infer<typeof paymentMethodSchema>

export const paymentSchema = z.object({
  id: z.string().min(1),
  memberId: z.string().min(1),
  memberName: z.string().min(1),
  description: z.string().min(1),
  cycle: paymentCycleSchema,
  periodStart: z.coerce.date().optional(),
  periodEnd: z.coerce.date().optional(),
  dueDate: z.coerce.date(),
  paidAt: z.coerce.date().nullable(),
  status: paymentStatusSchema,
  currency: currencyCodeSchema,
  baseAmountCents: z.number().int().nonnegative(),
  convenienceFeeCents: z.number().int().nonnegative().default(0),
  discountCents: z.number().int().nonnegative().default(0),
  method: paymentMethodSchema,
  reference: z.string().min(1).optional(),
})

export type Payment = z.infer<typeof paymentSchema>

export const billingSubscriptionSchema = z.object({
  id: z.string().min(1),
  memberIds: z.array(z.string().min(1)).min(1),
  memberDisplayName: z.string().min(1),
  cycle: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']),
  amountCents: z.number().int().nonnegative(),
  currency: currencyCodeSchema,
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  nextBillingDate: z.coerce.date(),
  status: z.enum(['active', 'paused', 'cancelled']),
})

export type BillingSubscription = z.infer<typeof billingSubscriptionSchema>

