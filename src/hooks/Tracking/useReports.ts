import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios'; 

export interface Report {
  id: string;
  actorId: string;
  actorFirstname: string;
  actorSurname: string;
  branchId?: string;
  branchName?: string;
  reportTypeId: string;
  description: string;
  occurredAt: string;
}

export const useReports = () => {
  const queryClient = useQueryClient();
  const reportsQuery = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data } = await axios.get('/api/report');
      return data;
    },
  });

  const createReportMutation = useMutation({
    mutationFn: async (newReport: Partial<Report>) => {
      const { data } = await axios.post('/api/report', newReport);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  const updateReportMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Report> & { id: string }) => {
      const { data } = await axios.patch(`/api/report/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  const deleteReportMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/report/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  return {
    reports: reportsQuery.data?.data ?? [],
    isLoading: reportsQuery.isLoading,
    isError: reportsQuery.isError,
    createReport: createReportMutation.mutateAsync,
    updateReport: updateReportMutation.mutateAsync,
    deleteReport: deleteReportMutation.mutateAsync,
    isCreating: createReportMutation.isPending,
    isUpdating: updateReportMutation.isPending,
    isDeleting: deleteReportMutation.isPending,
  };
};