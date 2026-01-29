import { z } from 'zod'

export const memberStatusSchema = z.enum(['IN', 'OUT', 'UNDECIDED'])


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
  middleName?: string
  surname: string
  suffix?: string
  status?: 'IN' | 'OUT' | 'UNDECIDED'
  name: string
  email?: string
  phone?: string
}

export interface MemberFormData {
  id: string
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
export type MemberFormValues = {
  createdById: string
  firstName: string
  middleName: string
  surname: string
  suffix: string
  profilePictureId: string
  status: 'IN' | 'OUT' | 'UNDECIDED'
}


export const apiErrorSchema = z.object({
  code: z.string().optional(),
  description: z.string().optional(),
})

export const apiMetaSchema = z.object({
  pageCount: z.number().optional(),
  pageIndex: z.number().optional(),
  pageSize: z.number().optional(),
  totalCount: z.number().optional(),
})

export const memberTableDataSchema = z.object({
  actorId: z.string().uuid().nullable().optional().transform((v) => v ?? undefined),
  createdById: z.string().uuid().nullable().optional().transform((v) => v ?? undefined),
  firstName: z.string(),
  id: z.string().uuid(),
  middleName: z.string().nullable().optional().transform((v) => v ?? undefined),
  status: memberStatusSchema,
  suffix: z.string().nullable().optional().transform((v) => v ?? undefined),
  surname: z.string(),
  updatedById: z.string().uuid().nullable().optional().transform((v) => v ?? undefined),
})

export const apiResponseMemberTableSchema = z.object({
  data: memberTableDataSchema,
  errors: z.array(apiErrorSchema).nullable().optional().transform((v) => v ?? undefined),
  message: z.string().optional(),
  meta: apiMetaSchema.nullable().optional().transform((v) => v ?? undefined),
  success: z.boolean(),
  timestamp: z.number().optional(),
})

export type ApiResponseMemberTable = z.infer<typeof apiResponseMemberTableSchema>

export const apiResponseListMemberTableSchema = z.object({
  data: z.array(memberTableDataSchema),
  errors: z.array(apiErrorSchema).nullable().optional().transform((v) => v ?? undefined),
  message: z.string().optional(),
  meta: apiMetaSchema.nullable().optional().transform((v) => v ?? undefined),
  success: z.boolean(),
  timestamp: z.number().optional(),
})

export type ApiResponseListMemberTable = z.infer<typeof apiResponseListMemberTableSchema>

export const memberPostDtoSchema = z.object({
  createdById: z.string().uuid(),
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  profilePictureId: z.string().uuid().optional(),
  status: memberStatusSchema,
  suffix: z.string().optional(),
  surname: z.string().min(1),
})

export type MemberPostDto = z.infer<typeof memberPostDtoSchema>
