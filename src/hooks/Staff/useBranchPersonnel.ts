import { useQuery } from '@tanstack/react-query';
import type { BranchPersonnelTableDTO } from '@/api/generated/models/BranchPersonnelTableDTO';
import { getAuthenticatedApi } from '@/lib/api-client';
import { BranchPersonnelApi } from '@/api/generated/apis';

const branchPersonnelApi = getAuthenticatedApi(BranchPersonnelApi);
export const useBranchPersonnel = (branchId: string) => {
  return useQuery<BranchPersonnelTableDTO[]>({
    queryKey: ['branchPersonnel', branchId],
    queryFn: async () => {
      const response = await branchPersonnelApi.getAllBranchPersonnel({ pageable: { page: 0, size: 100 } });
      return response.data?.filter(personnel => personnel.branchId === branchId) || [];
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
  });
};