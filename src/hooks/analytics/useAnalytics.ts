import { MOCK_ANALYTICS_DATA, type AnalyticsData } from 'src/lib/analytics-data'

export type AnalyticsFilters = {
  branch?: string
  startDate?: string
  endDate?: string
  timeRange?: 'monthly' | 'quarterly' | 'yearly'
}

// TEMPORARY: Mock API call - returns fake data after a delay
async function fetchApi<T>(endpoint: string): Promise<T> {
  console.log('📄 Mock API call to:', endpoint)
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Return mock data
  return MOCK_ANALYTICS_DATA as T
}

export const analyticsApi = {
  getAnalytics: async (filters: AnalyticsFilters): Promise<AnalyticsData> => {
    const params = new URLSearchParams()
    
    if (filters.branch && filters.branch !== 'all') {
      params.append('branch', filters.branch)
    }
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)
    if (filters.timeRange) params.append('timeRange', filters.timeRange)

    return fetchApi<AnalyticsData>(`api/analytics?${params}`)
  },
}