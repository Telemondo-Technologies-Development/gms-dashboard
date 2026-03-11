import { useMutation } from '@tanstack/react-query';
import { BranchApi } from '@/api/generated/apis/BranchApi';
import type { BranchPostDTO } from '@/api/generated/models/BranchPostDTO';

export function useAddBranch() {
  const branchApi = new BranchApi();

  const mutation = useMutation({
    mutationFn: async (branchData: BranchPostDTO) => {
      return await branchApi.createBranch({ branchPostDTO: branchData });
    },
  });

  return mutation;
}