import { useQuery } from '@tanstack/react-query';
import { getAuthenticatedApi } from '@/lib/api-client';
import { BranchApi } from '@/api/generated/apis';

export type BranchEmployeeItem = {
  actorId: string;
  employee: {
    firstName: string;
    middleName?: string;
    surname: string;
    suffix?: string;
    id: string;
  };
};

const branchApi = getAuthenticatedApi(BranchApi);

export const useBranchEmployees = (branchId: string) => {
  return useQuery<BranchEmployeeItem[]>({
    queryKey: ['branchEmployees', branchId],
    enabled: !!branchId,
    queryFn: async () => {
      const res = await branchApi.getBranchEmployees({ id: branchId } as any);
      return (res as any)?.data?.employees ?? (res as any)?.data?.data?.employees ?? [];
    },
  });
};
