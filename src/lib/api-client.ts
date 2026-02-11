import { Configuration } from '@/api/generated/runtime'
import { UserApi, EmployeeApi, PaymentApi, InvoiceApi } from '@/api/generated/apis'
import { readPersistedAuthToken, readAuthSession } from '@/lib/auth/auth-session'

const getConfiguration = () => {
  // Prefer Zustand-persisted session token; fallback to legacy localStorage key
  const session = readAuthSession()
  const persistedToken = readPersistedAuthToken()
  const token =
    session.token ??
    persistedToken ??
    (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : undefined)
  
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
export const paymentApi = new PaymentApi(getConfiguration())
export const invoiceApi = new InvoiceApi(getConfiguration())

// Helper to refresh configuration if token changes (basic approach)
export const getAuthenticatedApi = <T>(ApiClass: new (config: Configuration) => T): T => {
	return new ApiClass(getConfiguration())
}
