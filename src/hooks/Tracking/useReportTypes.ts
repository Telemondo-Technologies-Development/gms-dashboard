import { useQuery } from '@tanstack/react-query';
import { getAuthenticatedApi } from '@/lib/api-client';
import { ReportTypeApi } from '@/api/generated/apis';
import type { ReportTypeTableDTO, Pageable } from '@/api/generated/models';

const reportTypeApi = getAuthenticatedApi(ReportTypeApi);

export const useReportTypes = () => {
  return useQuery<ReportTypeTableDTO[]>({
    queryKey: ['reportTypes'],
    queryFn: async () => {
      const pageable: Pageable = {
        page: 0,
        size: 100,
      };
      const response = await reportTypeApi.getAll({ pageable });
      if (response && response.success) {
        return Array.isArray(response.data) ? response.data : [];
      }
      
      return [];
    },
    staleTime: 1000 * 60 * 30, 
  });
};