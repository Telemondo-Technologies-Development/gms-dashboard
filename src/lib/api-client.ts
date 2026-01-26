import { Configuration } from '@/api/generated/runtime'
import { UserApi, EmployeeApi } from '@/api/generated/apis'

const getConfiguration = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : undefined
  
  // Force relative path in DEV to usage Vite proxy to avoid CORS
  // In PROD, use the env var or empty string
  const basePath = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || '')
  
  return new Configuration({
    basePath,
    accessToken: token || undefined,
    headers: {
        'Content-Type': 'application/json',
    }
  })
}

export const userApi = new UserApi(getConfiguration())
export const employeeApi = new EmployeeApi(getConfiguration())

// Helper to refresh configuration if token changes (basic approach)
export const getAuthenticatedApi = <T>(ApiClass: new (config: Configuration) => T): T => {
	return new ApiClass(getConfiguration())
}
