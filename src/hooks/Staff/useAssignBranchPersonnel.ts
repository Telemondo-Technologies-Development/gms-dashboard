import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthenticatedApi } from '@/lib/api-client';
import { BranchPersonnelApi } from '@/api/generated/apis';
import type { BranchPersonnelPostDTOStatusEnum } from '@/api/generated/models/BranchPersonnelPostDTO';

const api = getAuthenticatedApi(BranchPersonnelApi);

type Input = {
  actorId: string;
  branchId: string;
  createdById: string;
  personnelRoleId: string;
  status: BranchPersonnelPostDTOStatusEnum;
};

export const useAssignBranchPersonnel = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: Input) => {
      const { actorId, branchId, createdById, personnelRoleId, status } = input;
      return api.createBranchPersonnel({
        branchPersonnelPostDTO: {
          actorId,
          branchId,
          createdById,
          personnelRoleId,
          status,
        },
      });
    },
    onSuccess: (_res, input) => {
      qc.invalidateQueries({ queryKey: ['branchPersonnel', input.branchId] });
      qc.invalidateQueries({ queryKey: ['branchEmployees', input.branchId] });
    },
  });
};
