import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthenticatedApi } from '@/lib/api-client';
import { BranchPersonnelApi } from '@/api/generated/apis';

const api = getAuthenticatedApi(BranchPersonnelApi);

type Input = { id: string; branchId: string };

export const useDeleteBranchPersonnel = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: Input) => api.deleteBranchPersonnel({ id }),
    onSuccess: (_res, input) => {
      qc.invalidateQueries({ queryKey: ['branchPersonnel', input.branchId] });
      qc.invalidateQueries({ queryKey: ['branchEmployees', input.branchId] });
    },
  });
};
