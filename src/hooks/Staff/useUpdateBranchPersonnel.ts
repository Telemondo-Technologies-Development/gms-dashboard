import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthenticatedApi } from '@/lib/api-client';
import { BranchPersonnelApi } from '@/api/generated/apis';
import type { BranchPersonnelPutDTOStatusEnum } from '@/api/generated/models/BranchPersonnelPutDTO';

const api = getAuthenticatedApi(BranchPersonnelApi);

type Input = {
  id: string; // branchPersonnel record id
  actorId: string;
  branchId: string;
  updatedById: string;
  status: BranchPersonnelPutDTOStatusEnum;
};

export const useUpdateBranchPersonnel = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: Input) => {
      return api.updateBranchPersonnel({
        id: input.id,
        branchPersonnelPutDTO: {
          actorId: input.actorId,
          branchId: input.branchId,
          status: input.status,
          updatedById: input.updatedById,
        },
      });
    },
    onSuccess: (_res, input) => {
      qc.invalidateQueries({ queryKey: ['branchPersonnel', input.branchId] });
      qc.invalidateQueries({ queryKey: ['branchEmployees', input.branchId] });
    },
  });
};
