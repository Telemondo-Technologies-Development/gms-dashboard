import { z } from 'zod'

export const memberStatusSchema = z.enum(['IN', 'OUT', 'UNDECIDED'])

export const subscriptionStatusSchema = z.enum(['ACTIVE', 'CANCELED', 'DONE'])

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

export interface AddMemberDialogProps {
  onAddMember: (member: MemberFormData) => void
}

export interface MemberInfo {
  id: string
  firstName: string
  middleName: string | null
  surname: string
  suffix: string | null
  status: 'IN' | 'OUT' | 'UNDECIDED' | null
  name: string
  email: string | null
  phone: string | null
}

export interface MemberFormData {
  id: string
  actorId: string | null
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
}

export interface MemberDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberGroup: MemberFormData | null
  onSave: (updated: MemberFormData) => void
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
  actorId: z.string().uuid().nullable().default(null),
  createdById: z.string().uuid().nullable().default(null),
  firstName: z.string(),
  id: z.string().uuid(),
  middleName: z.string().nullable().default(null),
  status: memberStatusSchema,
  suffix: z.string().nullable().default(null),
  surname: z.string(),
  updatedById: z.string().uuid().nullable().default(null),
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
  status: 'IN' | 'OUT' | 'UNDECIDED'
}

// API response schemas
export const apiErrorSchema = z.object({
  code: z.string().nullable().default(null),
  description: z.string().nullable().default(null),
  field: z.string().nullable().default(null),
})

export const apiMetaSchema = z.object({
  pageCount: z.number().nullable().default(null),
  pageIndex: z.number().nullable().default(null),
  pageSize: z.number().nullable().default(null),
  totalCount: z.number().nullable().default(null),
})

export const apiResponseMemberTableSchema = z.object({
  data: memberTableDataSchema,
  errors: z.array(apiErrorSchema).nullable().default(null),
  message: z.string().optional(),
  meta: apiMetaSchema.nullable().default(null),
  success: z.boolean(),
  timestamp: z.number().optional(),
})

export type ApiResponseMemberTable = z.infer<typeof apiResponseMemberTableSchema>

export const apiResponseListMemberTableSchema = z.object({
  data: z.array(memberTableDataSchema),
  errors: z.array(apiErrorSchema).nullable().default(null),
  message: z.string().optional(),
  meta: apiMetaSchema.nullable().default(null),
  success: z.boolean(),
  timestamp: z.number().optional(),
})

export type ApiResponseListMemberTable = z.infer<typeof apiResponseListMemberTableSchema>

// Member Subscription schemas
export const memberSubscriptionPostDtoSchema = z.object({
  actorId: z.string().uuid(),
  branchId: z.string().uuid(),
  createdById: z.string().uuid(),
  endDate: z.string().datetime().nullable(),
  startDate: z.string().datetime(),
  status: subscriptionStatusSchema,
  subscriptionId: z.string().uuid(),
})

export type MemberSubscriptionPostDto = z.infer<typeof memberSubscriptionPostDtoSchema>

export const memberSubscriptionPutDtoSchema = z.object({
  actorId: z.string().uuid(),
  branchId: z.string().uuid(),
  endDate: z.string().datetime().nullable(),
  startDate: z.string().datetime(),
  status: subscriptionStatusSchema,
  subscriptionId: z.string().uuid(),
  updateCurrentSubscription: z.boolean().nullable(),
  updatedById: z.string().uuid(),
})

export type MemberSubscriptionPutDto = z.infer<typeof memberSubscriptionPutDtoSchema>

export const memberSubscriptionTableDataSchema = z.object({
  actorId: z.string().uuid(),
  branchId: z.string().uuid(),
  createdById: z.string().uuid().nullable().default(null),
  endDate: z.string().datetime().nullable().default(null),
  id: z.string().uuid(),
  startDate: z.string().datetime(),
  status: subscriptionStatusSchema,
  subscriptionAvailedId: z.string().uuid().nullable().default(null),
  updatedById: z.string().uuid().nullable().default(null),
})

export type MemberSubscriptionTableData = z.infer<typeof memberSubscriptionTableDataSchema>
