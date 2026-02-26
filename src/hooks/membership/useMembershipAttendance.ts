import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'

import { AttendanceApi } from '@/api/generated/apis/AttendanceApi'
import type { AttendanceTableDTO } from '@/api/generated/models/AttendanceTableDTO'
import { memberQueryKeys } from '@/lib/QueryKeys'
import { getAuthenticatedApi } from '@/lib/api-client'
import { apiResponseListAttendanceTableSchema } from '@/types/membership/memberSchemas'

export function useAttendance(enabled = true) {
  const attendanceApi = getAuthenticatedApi(AttendanceApi)

  const queryFn = useCallback(async () => {
    const response = await attendanceApi.getAllAttendances({
      pageable: {
        page: 0,
        size: 1000,
      },
    })

    const parsed = apiResponseListAttendanceTableSchema.parse(response)
    if (!parsed.success) {
      throw new Error(parsed.message ?? 'Failed to fetch attendance records.')
    }

    return parsed.data as AttendanceTableDTO[]
  }, [attendanceApi])

  return useQuery<AttendanceTableDTO[]>({
    queryKey: [memberQueryKeys.attendances],
    enabled,
    queryFn,
    retry: false,
    staleTime: 15_000,
  })
}
