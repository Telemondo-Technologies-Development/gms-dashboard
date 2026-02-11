import { z } from 'zod'


export interface EnsureInvoiceInput {
  actorId: string
  branchId: string
  createdById: string
  memberSubscriptionId: string
  subscriptionAvailedId: string
  dueDate: Date
  gracePeriodDays: number
  subtotal: number
}

export interface CreatePaymentIfNeededInput {
  paymentMethodId: string
  invoiceId: string | undefined
  createdById: string
  amount: number
  paidAt?: Date
}

const coerceNullableDate = z.preprocess((value) => {
	if (value == null || value === '') return null
	if (value instanceof Date) return value
	const date = new Date(String(value))
	return Number.isNaN(date.getTime()) ? null : date
}, z.date().nullable())

export const pageMetadataSchema = z.object({
	pageCount: z.coerce.number(),
	pageIndex: z.coerce.number(),
	pageSize: z.coerce.number(),
	totalCount: z.coerce.number(),
})

export type PageMetadata = z.infer<typeof pageMetadataSchema>

export const paymentStatusSchema = z.enum(['IN', 'OUT', 'UNDECIDED'])
export type PaymentStatus = z.infer<typeof paymentStatusSchema>

export const paymentTableDTOSchema = z.object({
	amount: z.coerce.number(),
	createdById: z.string(),
	failureReason: z.string().nullable().default(null),
	id: z.string(),
	invoiceId: z.string(),
	paidAt: coerceNullableDate,
	paymentMethodId: z.string(),
	status: paymentStatusSchema,
	updatedById: z.string().nullable().default(null),
})

export type PaymentTableDTOParsed = z.infer<typeof paymentTableDTOSchema>

export const paymentMethodTableDTOSchema = z.object({
	createdById: z.string().nullable().default(null),
	id: z.string(),
	name: z.string(),
	updatedById: z.string().nullable().default(null),
})

export type PaymentMethodTableDTOParsed = z.infer<typeof paymentMethodTableDTOSchema>

export const paymentMethodPostSchema = z.object({
	createdById: z.string().min(1),
	name: z.string().min(1),
})

export type PaymentMethodPostInput = z.infer<typeof paymentMethodPostSchema>

const apiErrorSchema = z
	.object({
		message: z.string().optional(),
	})
	.passthrough()

export const apiResponseListPaymentTableDTOSchema = z.object({
	data: z.array(paymentTableDTOSchema).optional(),
	errors: z.array(apiErrorSchema).optional(),
	message: z.string().optional(),
	meta: pageMetadataSchema.optional(),
	success: z.boolean(),
	timestamp: z.coerce.number(),
})

export type ApiResponseListPaymentTableDTOParsed = z.infer<typeof apiResponseListPaymentTableDTOSchema>

export const apiResponsePaymentTableDTOSchema = z.object({
	data: paymentTableDTOSchema.optional(),
	errors: z.array(apiErrorSchema).optional(),
	message: z.string().optional(),
	meta: pageMetadataSchema.optional(),
	success: z.boolean(),
	timestamp: z.coerce.number(),
})

export type ApiResponsePaymentTableDTOParsed = z.infer<typeof apiResponsePaymentTableDTOSchema>

export const apiResponseListPaymentMethodTableDTOSchema = z.object({
	data: z.array(paymentMethodTableDTOSchema).optional(),
	errors: z.array(apiErrorSchema).optional(),
	message: z.string().optional(),
	meta: pageMetadataSchema.optional(),
	success: z.boolean(),
	timestamp: z.coerce.number(),
})

export const apiResponsePaymentMethodTableDTOSchema = z.object({
	data: paymentMethodTableDTOSchema.optional(),
	errors: z.array(apiErrorSchema).optional(),
	message: z.string().optional(),
	meta: pageMetadataSchema.optional(),
	success: z.boolean(),
	timestamp: z.coerce.number(),
})

export type ApiResponseListPaymentMethodTableDTOParsed = z.infer<
	typeof apiResponseListPaymentMethodTableDTOSchema
>

// Form schema for payment history filters (usable with RHF + zodResolver or TanStack Form)
export const paymentHistoryFiltersSchema = z
	.object({
		query: z.string().default(''),
		status: z.enum(['all', 'paid', 'pending', 'failed']).default('all'),
		fromDate: z.string().default(''),
		toDate: z.string().default(''),
	})
	.refine(
		(value) => {
			if (!value.fromDate || !value.toDate) return true
			return new Date(value.fromDate).getTime() <= new Date(value.toDate).getTime()
		},
		{ message: 'From date must be before To date' },
	)

export type PaymentHistoryFilters = z.infer<typeof paymentHistoryFiltersSchema>

// Invoice schemas for linking payments to invoices
export const invoiceStatusSchema = z.enum(['DRAFT', 'ISSUED', 'PAID', 'OVERDUE'])
export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>

const coerceDate = z.preprocess((value) => {
	if (value instanceof Date) return value
	const d = new Date(String(value))
	return d
}, z.date())

export const invoiceTableDTOSchema = z.object({
	actorId: z.string().optional(),
	branchId: z.string().optional(),
	createdById: z.string(),
	dueDate: coerceDate,
	gracePeriodDate: coerceDate,
	id: z.string(),
	issuedAt: coerceDate,
	memberSubscriptionId: z.string().optional(),
	status: invoiceStatusSchema,
	subscriptionAvailedId: z.string().optional(),
	subtotal: z.coerce.number(),
	systemGenerated: z.boolean(),
	total: z.coerce.number(),
	updatedById: z.string().optional(),
})

export type InvoiceTableDTOParsed = z.infer<typeof invoiceTableDTOSchema>

export const apiResponseListInvoiceTableDTOSchema = z.object({
	data: z.array(invoiceTableDTOSchema).optional(),
	errors: z.array(apiErrorSchema).optional(),
	message: z.string().optional(),
	meta: pageMetadataSchema.optional(),
	success: z.boolean(),
	timestamp: z.coerce.number(),
})

export type ApiResponseListInvoiceTableDTOParsed = z.infer<typeof apiResponseListInvoiceTableDTOSchema>

export const apiResponseInvoiceTableDTOSchema = z.object({
	data: invoiceTableDTOSchema.optional(),
	errors: z.array(apiErrorSchema).optional(),
	message: z.string().optional(),
	meta: pageMetadataSchema.optional(),
	success: z.boolean(),
	timestamp: z.coerce.number(),
})

export type ApiResponseInvoiceTableDTOParsed = z.infer<typeof apiResponseInvoiceTableDTOSchema>
