import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// 1. Use the actual DTO structure for read operations
export interface ReportTableDTO {
  id: string;
  actorId: string;
  actorFirstname: string;
  actorSurname: string;
  actorStatus: string;
  branchId: string;
  branchName: string;
  reportTypeId: string;
  description: string;
  occurredAt: string;
  objectIds: string[];
  createdByFirstName: string;
  createdBySurname: string;
}

// 2. Define what the Frontend sends to the Backend
// We use actorIds (plural) to support multiple people in one form submission
export interface CreateReportPayload {
  actorIds: string[]; 
  branchId: string;
  reportTypeId: string;
  description: string;
  occurredAt: string;
}

export const useReports = () => {
  const queryClient = useQueryClient();

  // Fetching reports
  const reportsQuery = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const { data } = await axios.get<{ data: ReportTableDTO[] }>('/api/report');
      // We return the raw data; grouping/counting is now handled in the UI if needed
      return data.data ?? [];
    },
  });

  // Create Report Mutation
  const createReportMutation = useMutation({
    mutationFn: async (payload: CreateReportPayload) => {
      const { actorIds, ...rest } = payload;

      /**
       * INSTRUCTOR REQUIREMENT: Multiple people on 1 incident.
       * If your backend API only accepts one actorId per POST, 
       * we loop through the actorIds and create a unique record for each.
       */
      const requests = actorIds.map((id) =>
        axios.post('/api/report', {
          ...rest,
          actorId: id, // Mapping the array back to the single ID the backend expects
        })
      );

      return Promise.all(requests);
    },
    onSuccess: () => {
      // Refresh the table immediately so the new unique reports appear
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  // Update Report Mutation
  const updateReportMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ReportTableDTO> & { id: string }) => {
      const { data } = await axios.patch(`/api/report/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  // Delete Report Mutation
  const deleteReportMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/report/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  return {
    // Every report is now treated as a unique record (Incident-centric)
    reports: reportsQuery.data ?? [],
    isLoading: reportsQuery.isLoading,
    isError: reportsQuery.isError,
    
    // Actions
    createReport: createReportMutation.mutateAsync,
    updateReport: updateReportMutation.mutateAsync,
    deleteReport: deleteReportMutation.mutateAsync,
    
    // Pending States
    isCreating: createReportMutation.isPending,
    isUpdating: updateReportMutation.isPending,
    isDeleting: deleteReportMutation.isPending,
  };
};