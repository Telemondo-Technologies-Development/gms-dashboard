import { useQuery } from '@tanstack/react-query';
import { getAuthenticatedApi } from '@/lib/api-client';
import { BranchPersonnelRolesApi } from '@/api/generated/apis';

const api = getAuthenticatedApi(BranchPersonnelRolesApi);

export const usePersonnelRoles = () => {
  return useQuery({
    queryKey: ['personnel-roles'],
    queryFn: async () => {
      const response = await api.getAllPersonnelRoles({ pageable: { page: 0, size: 10 } });
      return (response as any)?.data ?? response ?? [];
    },
    staleTime: 1000 * 60 * 30, 
  });
};