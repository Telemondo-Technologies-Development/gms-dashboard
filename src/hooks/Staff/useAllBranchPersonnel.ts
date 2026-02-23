import { useQuery } from '@tanstack/react-query';
import { getAuthenticatedApi } from '@/lib/api-client';
import { BranchPersonnelApi } from '@/api/generated/apis';
import type { BranchPersonnelTableDTO } from '@/api/generated/models/BranchPersonnelTableDTO';

const api = getAuthenticatedApi(BranchPersonnelApi);

export const useAllBranchPersonnel = () => {
  return useQuery<BranchPersonnelTableDTO[]>({
    queryKey: ['branchPersonnelAll'],
    queryFn: async () => {
      const res = await api.getAllBranchPersonnel({ pageable: { page: 0, size: 1000 } });
      return res.data ?? [];
    },
  });
};
