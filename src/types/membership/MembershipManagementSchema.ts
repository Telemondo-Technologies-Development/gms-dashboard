import { z } from 'zod'

export const memberStatusSchema = z.enum(['UNDECIDED', 'ACTIVE', 'DEACTIVATED'])

export const attendanceSourceSchema = z.enum(['MANUAL', 'QR', 'FACE', 'FINGERPRINT'])
export const attendanceTypeSchema = z.enum(['IN', 'OUT', 'UNDECIDED'])

export const subscriptionStatusSchema = z.enum(['ACTIVE', 'CANCELED', 'DONE'])

const nullToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => (value === null ? undefined : value), schema.optional())

export interface AttendanceRecord {
  id: string
  memberId: string
  memberName: string
  membershipType: string
  checkInTime: Date
  checkInMethod: 'qr' | 'fingerprint' | 'manual'
}

export type MembershipSearchForm = {
  searchQuery: string
  attendanceSearch: string
}

// MembershipAddDialog main then sub feature then type

// AddMemberDialog no longer needs props - uses React Query cache invalidation
export interface AddMemberDialogProps {}

export interface MemberInfo {
  id: string
  firstName: string
  middleName?: string | null
  surname: string
  suffix?: string | null
  status?: 'UNDECIDED' | 'ACTIVE' | 'DEACTIVATED' | null
  name: string
  email?: string | null
  phone?: string | null
}

export interface MemberFormData {
  id: string
  actorId?: string | null
  members: MemberInfo[]
  startDate?: Date
  endDate?: Date
  membershipType: string
  membershipDuration: string
  billingAmount: string
  billingCycle: string
  paymentMethod: string
  membershipDetails: string
  documents: File[]
  /** Full name of the staff/admin who recorded this member, sourced inline from the API DTO */
  recorderName?: string | null
}

export interface MemberDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberGroup?: MemberFormData | null
}

// Backend DTO schemas
export const memberPostDtoSchema = z.object({
  createdById: z.string().uuid(),
  firstName: z.string().min(1),
  middleName: z.string().min(1).optional(),
  profilePictureId: z.string().uuid().optional(),
  status: memberStatusSchema,
  suffix: z.string().min(1).optional(),
  surname: z.string().min(1),
})

export type MemberPostDto = z.infer<typeof memberPostDtoSchema>

export const memberPutDtoSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string().min(1).optional(),
  profilePictureId: z.string().uuid().optional(),
  status: memberStatusSchema,
  suffix: z.string().min(1).optional(),
  surname: z.string().min(1),
  updatedById: z.string().uuid(),
})

export type MemberPutDto = z.infer<typeof memberPutDtoSchema>

export const memberTableDataSchema = z.object({
  actorId: nullToUndefined(z.string().uuid()),
  createdById: nullToUndefined(z.string().uuid()),
  createdByFirstName: nullToUndefined(z.string()),
  createdBySurname: nullToUndefined(z.string()),
  createdByEmail: nullToUndefined(z.string()),
  firstName: z.string(),
  id: z.string().uuid(),
  middleName: nullToUndefined(z.string()),
  status: memberStatusSchema,
  suffix: nullToUndefined(z.string()),
  surname: z.string(),
  updatedById: nullToUndefined(z.string().uuid()),
})

export type MemberTableData = z.infer<typeof memberTableDataSchema>

// Form values type for member forms
export type MemberFormValues = {
  createdById: string
  firstName: string
  middleName: string
  surname: string
  suffix: string
  profilePictureId: string
  status: 'UNDECIDED' | 'ACTIVE' | 'DEACTIVATED'
}

// API response schemas
export const apiErrorSchema = z.object({
  code: nullToUndefined(z.string()),
  description: nullToUndefined(z.string()),
  field: nullToUndefined(z.string()),
})

export const apiMetaSchema = z.object({
  pageCount: nullToUndefined(z.number()),
  pageIndex: nullToUndefined(z.number()),
  pageSize: nullToUndefined(z.number()),
  totalCount: nullToUndefined(z.number()),
})

export const apiResponseMemberTableSchema = z.object({
  data: memberTableDataSchema,
  errors: nullToUndefined(z.array(apiErrorSchema)),
  message: z.string().optional(),
  meta: nullToUndefined(apiMetaSchema),
  success: z.boolean(),
  timestamp: z.number().optional(),
})

export type ApiResponseMemberTable = z.infer<typeof apiResponseMemberTableSchema>

export const apiResponseListMemberTableSchema = z.object({
  data: z.array(memberTableDataSchema),
  errors: nullToUndefined(z.array(apiErrorSchema)),
  message: z.string().optional(),
  meta: nullToUndefined(apiMetaSchema),
  success: z.boolean(),
  timestamp: z.number().optional(),
})

export type ApiResponseListMemberTable = z.infer<typeof apiResponseListMemberTableSchema>

export const attendanceTableDataSchema = z.object({
  actorId: z.string().uuid().optional(),
  branchId: z.string().uuid().optional(),
  createdById: z.string().uuid().optional(),
  id: z.string().uuid(),
  recordedAt: z.coerce.date(),
  source: attendanceSourceSchema,
  type: attendanceTypeSchema,
  updatedById: z.string().uuid().optional(),
})

export type AttendanceTableData = z.infer<typeof attendanceTableDataSchema>

export const apiResponseListAttendanceTableSchema = z.object({
  data: z.array(attendanceTableDataSchema),
  errors: z.array(apiErrorSchema).optional(),
  message: z.string().optional(),
  meta: apiMetaSchema.optional(),
  success: z.boolean(),
  timestamp: z.number().optional(),
})

export type ApiResponseListAttendanceTable = z.infer<typeof apiResponseListAttendanceTableSchema>

// Member Subscription schemas
export const memberSubscriptionPostDtoSchema = z.object({
  actorId: z.string().uuid(),
  branchId: z.string().uuid(),
  createdById: z.string().uuid(),
  endDate: z.string().datetime().optional(),
  startDate: z.string().datetime(),
  status: subscriptionStatusSchema,
  subscriptionId: z.string().uuid(),
})

export type MemberSubscriptionPostDto = z.infer<typeof memberSubscriptionPostDtoSchema>

export const memberSubscriptionPutDtoSchema = z.object({
  actorId: z.string().uuid(),
  branchId: z.string().uuid(),
  endDate: z.string().datetime().optional(),
  startDate: z.string().datetime(),
  status: subscriptionStatusSchema,
  subscriptionId: z.string().uuid(),
  updateCurrentSubscription: z.boolean().optional(),
  updatedById: z.string().uuid(),
})

export type MemberSubscriptionPutDto = z.infer<typeof memberSubscriptionPutDtoSchema>

export const memberSubscriptionTableDataSchema = z.object({
  actorId: z.string().uuid(),
  branchId: z.string().uuid(),
  createdById: z.string().uuid().optional(),
  endDate: z.string().datetime().optional(),
  id: z.string().uuid(),
  startDate: z.string().datetime(),
  status: subscriptionStatusSchema,
  subscriptionAvailedId: z.string().uuid().optional(),
  updatedById: z.string().uuid().optional(),
})

export type MemberSubscriptionTableData = z.infer<typeof memberSubscriptionTableDataSchema>

const apiEnvelopeSchema = z
  .object({
    success: z.boolean(),
    message: z.string().optional(),
    errors: z.array(apiErrorSchema).optional(),
  })
  .passthrough()

const apiMemberSubscriptionIdEnvelopeSchema = apiEnvelopeSchema.extend({
  data: z
    .object({
      id: z.string().min(1),
    })
    .optional(),
})

export function getMembershipApiErrorMessage(payload: unknown, fallback: string): string {
  const parsed = apiEnvelopeSchema.safeParse(payload)
  if (!parsed.success) return fallback

  const envelope = parsed.data
  const message = envelope.message?.trim()
  if (message) return message

  const firstError = envelope.errors?.find((item) => item.description || item.code || item.field)
  if (!firstError) return fallback

  return firstError.description ?? firstError.code ?? firstError.field ?? fallback
}

export function toMembershipErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return getMembershipApiErrorMessage(error, fallback)
}

export function assertMembershipApiSuccess(payload: unknown, fallback: string): void {
  const parsed = apiEnvelopeSchema.safeParse(payload)
  if (!parsed.success || !parsed.data.success) {
    throw new Error(getMembershipApiErrorMessage(payload, fallback))
  }
}

export function getCreatedMemberSubscriptionId(payload: unknown, fallback: string): string {
  const parsed = apiMemberSubscriptionIdEnvelopeSchema.safeParse(payload)
  if (!parsed.success || !parsed.data.success || !parsed.data.data?.id) {
    throw new Error(getMembershipApiErrorMessage(payload, fallback))
  }

  return parsed.data.data.id
}


export interface MembershipAddAttendanceProps {
  members: MemberFormData[]
}

export interface AttendanceTableRow {
  id: string
  actorId: string
  memberName: string
  membershipType: string
  source: string
  status: string
  recordedAt?: Date | null
  attendanceDate?: Date | null
}
