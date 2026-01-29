import { z } from 'zod'

const coerceOptionalDate = z.preprocess((value) => {
	if (value == null || value === '') return undefined
	if (value instanceof Date) return value
	const date = new Date(String(value))
	return Number.isNaN(date.getTime()) ? undefined : date
}, z.date().optional())

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
	failureReason: z
		.string()
		.optional()
		.nullable()
		.transform((value) => value ?? undefined),
	id: z.string(),
	invoiceId: z.string(),
	paidAt: coerceOptionalDate,
	paymentMethodId: z.string(),
	status: paymentStatusSchema,
	updatedById: z
		.string()
		.optional()
		.nullable()
		.transform((value) => value ?? undefined),
})

export type PaymentTableDTOParsed = z.infer<typeof paymentTableDTOSchema>

export const paymentMethodTableDTOSchema = z.object({
	createdById: z
		.string()
		.optional()
		.nullable()
		.transform((value) => value ?? undefined),
	id: z.string(),
	name: z.string(),
	updatedById: z
		.string()
		.optional()
		.nullable()
		.transform((value) => value ?? undefined),
})

export type PaymentMethodTableDTOParsed = z.infer<typeof paymentMethodTableDTOSchema>

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
