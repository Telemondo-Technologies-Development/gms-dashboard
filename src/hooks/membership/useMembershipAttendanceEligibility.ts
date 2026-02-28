import { useCallback } from 'react'

import type { MemberFormData } from '@/types/membership/MembershipManagementSchema'

export interface AttendanceEligibilityResult {
  isEligible: boolean
  reason?: string
}

function toStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function useAttendanceEligibility() {
  const getAttendanceEligibility = useCallback((member: MemberFormData): AttendanceEligibilityResult => {
    if (!member.actorId) {
      return {
        isEligible: false,
        reason: 'Cannot add attendance: member has no actor id.',
      }
    }

    if (!member.startDate) {
      return {
        isEligible: false,
        reason: 'Cannot add attendance: member has no active subscription.',
      }
    }

    const today = toStartOfDay(new Date())
    const subscriptionStart = toStartOfDay(new Date(member.startDate))

    if (subscriptionStart > today) {
      return {
        isEligible: false,
        reason: 'Cannot add attendance: subscription has not started yet.',
      }
    }

    if (!member.endDate) {
      return { isEligible: true }
    }

    const subscriptionEnd = toStartOfDay(new Date(member.endDate))
    if (subscriptionEnd < today) {
      return {
        isEligible: false,
        reason: 'Cannot add attendance: subscription has expired.',
      }
    }

    return { isEligible: true }
  }, [])

  const canAddAttendance = useCallback((member: MemberFormData) => getAttendanceEligibility(member).isEligible, [getAttendanceEligibility])

  return {
    getAttendanceEligibility,
    canAddAttendance,
  }
}
