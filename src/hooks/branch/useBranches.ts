import { useQuery } from '@tanstack/react-query';

// The fetcher function stays the same, but lives inside the hook file
const fetchBranchesFromApi = async () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const base = import.meta.env.DEV ? '' : (apiBaseUrl || '');
  const url = `${base}/api/branch`;

  const token = localStorage.getItem('auth_token');
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to fetch branches.');
  const result = await response.json();
  return result.data || [];
};

export function useBranches() {
  const query = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranchesFromApi,

    staleTime: 1000 * 60 * 5, 
  });

  return {
    branches: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}