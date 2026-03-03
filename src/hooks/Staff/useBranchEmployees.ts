import { useQuery } from '@tanstack/react-query';
import { getAuthenticatedApi } from '@/lib/api-client';
import { BranchApi } from '@/api/generated/apis';
export type BranchEmployeeItem = {
  actorId: string;
  employeeContactNo: string;
  employeeFirstName: string;
  employeeId: string;
  employeeMiddleName?: string;
  employeeSuffix?: string;
  employeeSurname: string;
  personnelRoleDescription: string;
  personnelRoleId: string;
  personnelRoleName: string;
};

const branchApi = getAuthenticatedApi(BranchApi);

export const useBranchEmployees = (branchId: string) => {
  return useQuery<BranchEmployeeItem[]>({
    queryKey: ['branchEmployees', branchId],
    enabled: !!branchId,
    queryFn: async () => {
      const res = await branchApi.getBranchEmployees({ id: branchId } as any);
      const data = (res as any)?.data ?? []; 
      
      return Array.isArray(data) ? data : [];
    },
  });
};