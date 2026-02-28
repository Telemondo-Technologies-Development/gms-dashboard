import { z } from 'zod'

import type { AttendanceTableRow } from '@/types/membership/MembershipManagementSchema'
import { parseDateInput } from '@/lib/date-utils'

const attendanceDateCandidateSchema = z
  .object({
    createdAt: z.unknown().optional(),
    updatedAt: z.unknown().optional(),
    timestamp: z.unknown().optional(),
    attendanceDate: z.unknown().optional(),
    date: z.unknown().optional(),
  })
  .passthrough()

export function getAttendanceRecordDate(value: unknown): Date | null {
  const parsed = attendanceDateCandidateSchema.safeParse(value)
  if (!parsed.success) {
    return null
  }

  const candidate =
    parsed.data.createdAt ??
    parsed.data.updatedAt ??
    parsed.data.timestamp ??
    parsed.data.attendanceDate ??
    parsed.data.date

  return parseDateInput(candidate)
}

export function sortAttendanceRowsByDateStack(rows: AttendanceTableRow[]): AttendanceTableRow[] {
  return [...rows].sort((left, right) => {
    const leftTime = left.attendanceDate?.getTime() ?? 0
    const rightTime = right.attendanceDate?.getTime() ?? 0

    if (rightTime !== leftTime) {
      return rightTime - leftTime
    }

    return right.id.localeCompare(left.id)
  })
}
