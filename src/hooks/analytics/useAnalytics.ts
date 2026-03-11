import { useQuery } from '@tanstack/react-query'
import { MOCK_ANALYTICS_DATA, type AnalyticsData } from '@/lib/analytics/analytics-data'
import { analyticsApi, type AnalyticsFilters } from '@/lib/analytics/analyticsApi'

export interface UseAnalyticsOptions {
  enabled?: boolean
}

export interface UseAnalyticsResult {
  data: AnalyticsData | undefined
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
}

// Returns true when the API responded successfully but the database has no
// records yet — all meaningful fields are zero or empty arrays.
function isEmptyData(d: AnalyticsData): boolean {
  return (
    d.monthlyIncome.current === 0 &&
    d.annualIncome.current === 0 &&
    !d.revenueExpense?.length &&
    !d.paymentMethods?.length
  )
}

/**
 * Hook to fetch analytics data with real API + fallback to mock data.
 * Falls back to MOCK_ANALYTICS_DATA when:
 * 1. The query errors out, OR
 * 2. The query resolves but returns no data (undefined), OR
 * 3. The query returns data but every metric is zero (empty database)
 */
export function useAnalytics(
  filters: AnalyticsFilters,
  options?: UseAnalyticsOptions,
): UseAnalyticsResult {
  const { enabled = true } = options || {}

  const query = useQuery({
    queryKey: ['analytics', filters],
    queryFn: () => analyticsApi.getAnalytics(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
    retry: 1,
  })

  const data: AnalyticsData | undefined = query.isLoading
    ? undefined
    : query.data && !isEmptyData(query.data)
      ? query.data
      : MOCK_ANALYTICS_DATA

  // Debug logging
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    if (query.isLoading) {
      console.debug('[Analytics] Loading data...', filters)
    } else if (query.isError) {
      console.warn('[Analytics] API Error - using mock data:', query.error)
    } else if (!query.data) {
      console.debug('[Analytics] No API data returned - using mock data')
    } else if (isEmptyData(query.data)) {
      console.debug('[Analytics] Empty database - using mock data')
    } else {
      console.debug('[Analytics] Using real API data:', query.data)
    }
  }

  return {
    data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error as Error | null,
  }
}

export type { AnalyticsFilters }