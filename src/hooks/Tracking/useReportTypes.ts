import { useQuery } from '@tanstack/react-query';
import { getAuthenticatedApi } from '@/lib/api-client';
import { ReportTypeApi } from '@/api/generated/apis';
import type { ReportTypeTableDTO, Pageable } from '@/api/generated/models';

const reportTypeApi = getAuthenticatedApi(ReportTypeApi);

export const useReportTypes = () => {
  return useQuery<ReportTypeTableDTO[]>({
    queryKey: ['reportTypes'],
    queryFn: async () => {
      // Call the generated API with pagination
      const pageable: Pageable = {
        page: 0,
        size: 100,
      };
      const response = await reportTypeApi.getAll({ pageable });
      
      // Extract the actual data array from the wrapper
      if (response && response.success) {
        return Array.isArray(response.data) ? response.data : [];
      }
      
      return [];
    },
    // Since report types don't change often, cache for 30 minutes
    staleTime: 1000 * 60 * 30, 
  });
};