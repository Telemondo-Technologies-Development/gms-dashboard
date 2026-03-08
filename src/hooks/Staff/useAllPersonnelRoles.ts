import { useQuery } from '@tanstack/react-query';
import { getAuthenticatedApi } from '@/lib/api-client';
import { BranchPersonnelRolesApi } from '@/api/generated/apis';
import type { PersonnelRoleTableDTO } from '@/api/generated/models/PersonnelRoleTableDTO';
import { employeeQueryKeys } from '@/lib/QueryKeys';

const api = getAuthenticatedApi(BranchPersonnelRolesApi);

export const useAllPersonnelRoles = () => {
  return useQuery<PersonnelRoleTableDTO[]>({
    queryKey: employeeQueryKeys.personnelRolesAll,
    queryFn: async () => {
      const res = await api.getAllPersonnelRoles({ pageable: { page: 0, size: 10 } });
      return res.data ?? [];
    },
    staleTime: 5 * 60_000,
  });
};
