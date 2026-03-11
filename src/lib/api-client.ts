import { Configuration } from '@/api/generated/runtime'
import { UserApi, EmployeeApi, PaymentApi, InvoiceApi, BranchApi, AccessControlApi } from '@/api/generated/apis'
import { readAuthSession } from '@/lib/auth/auth-session'


function getToken(): string | undefined {
  const token = readAuthSession().token ?? undefined

  
  if (typeof window !== 'undefined' && token) {
    if (localStorage.getItem('auth_token') !== token) {
      localStorage.setItem('auth_token', token)
    }
  }

  return token
}


const getConfiguration = (): Configuration => {
  const basePath = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || '')
  return new Configuration({
    basePath,
    accessToken: getToken(),
    headers: { 'Content-Type': 'application/json' },
  })
}


export const getAuthenticatedApi = <T>(ApiClass: new (config: Configuration) => T): T =>
  new ApiClass(getConfiguration())


export const userApi     = new Proxy({} as UserApi,     { get: (_, p) => getAuthenticatedApi(UserApi)[p as keyof UserApi] })
export const employeeApi = new Proxy({} as EmployeeApi, { get: (_, p) => getAuthenticatedApi(EmployeeApi)[p as keyof EmployeeApi] })
export const paymentApi  = new Proxy({} as PaymentApi,  { get: (_, p) => getAuthenticatedApi(PaymentApi)[p as keyof PaymentApi] })
export const invoiceApi  = new Proxy({} as InvoiceApi,  { get: (_, p) => getAuthenticatedApi(InvoiceApi)[p as keyof InvoiceApi] })
export const branchApi          = new Proxy({} as BranchApi,          { get: (_, p) => getAuthenticatedApi(BranchApi)[p as keyof BranchApi] })
export const accessControlApi   = new Proxy({} as AccessControlApi,   { get: (_, p) => getAuthenticatedApi(AccessControlApi)[p as keyof AccessControlApi] })

export { UserApi, EmployeeApi, PaymentApi, InvoiceApi, BranchApi, AccessControlApi }