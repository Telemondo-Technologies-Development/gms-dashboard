import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthenticatedApi } from '@/lib/api-client';
import { BranchPersonnelApi } from '@/api/generated/apis';
import type { BranchPersonnelPutDTOStatusEnum } from '@/api/generated/models/BranchPersonnelPutDTO';

const api = getAuthenticatedApi(BranchPersonnelApi);

type Input = {
  id: string; 
  actorId: string;
  branchId: string;
  personnelRoleId: string;
  updatedById: string;
  status: BranchPersonnelPutDTOStatusEnum;
};

export const useUpdateBranchPersonnel = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: Input) => {
      const { id, actorId, branchId, personnelRoleId, updatedById, status } = input;
      return api.updateBranchPersonnel({
        id,
        branchPersonnelPutDTO: {
          actorId,
          branchId,
          personnelRoleId,
          status,
          updatedById,
        },
      });
    },
    onSuccess: (_res, input) => {
      qc.invalidateQueries({ queryKey: ['branchPersonnel', input.branchId] });
      qc.invalidateQueries({ queryKey: ['branchEmployees', input.branchId] });
    },
  });
};
