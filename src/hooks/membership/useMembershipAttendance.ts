import { useQuery } from '@tanstack/react-query'

import { AttendanceApi } from '@/api/generated/apis/AttendanceApi'
import { memberQueryKeys } from '@/lib/QueryKeys'
import { getAuthenticatedApi } from '@/lib/api-client'
import type { AttendanceTableData } from '@/types/membership/MembershipManagementSchema'

const attendanceApi = getAuthenticatedApi(AttendanceApi)

export function useAttendance(enabled = true) {
  return useQuery<AttendanceTableData[]>({
    queryKey: [memberQueryKeys.attendances],
    enabled,
    queryFn: async () => {
      const res = await attendanceApi.getAllAttendances({ pageable: { page: 0, size: 1000 } })
      return (res.data ?? []) as AttendanceTableData[]
    },
    retry: false,
    staleTime: 15_000,
  })
}
