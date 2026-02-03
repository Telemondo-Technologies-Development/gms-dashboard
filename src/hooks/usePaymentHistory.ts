import { useQuery } from '@tanstack/react-query'
import { ZodError } from 'zod'
import { getAuthenticatedApi } from '@/lib/api-client'
import { PaymentApi, InvoiceApi } from '@/api/generated/apis'
import type { PaymentTableDTO, InvoiceTableDTO, PaymentMethodTableDTO } from '@/api/generated/models'
import { useAuthStore } from '@/lib/auth-session'

import {
  apiResponseListPaymentMethodTableDTOSchema,
  apiResponseListPaymentTableDTOSchema,
  apiResponsePaymentTableDTOSchema,
  apiResponseListInvoiceTableDTOSchema,
} from '@/types/payment/paymentSchemas'


const PAYMENT_QUERY_KEYS = {
  payments: 'payments',
  paymentMethods: 'payment-methods',
  paymentInvoices: 'invoices',
}

function zodIssueSummary(error: ZodError, maxIssues: number = 3): string {
  const issues = error.issues.slice(0, Math.max(1, maxIssues))
  return issues
    .map((issue) => {
      const path = issue.path.length ? issue.path.join('.') : '(root)'
      return `${path}: ${issue.message}`
    })
    .join('; ')
}

function isDebugBillingEnabled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get('debugBilling') === '1' || params.get('debug') === '1') return true
    return window.localStorage.getItem('debugBilling') === '1'
  } catch {
    return false
  }
}

/**
 * Hook to fetch all payments with pagination
 */
export function usePayments(page: number = 0, size: number = 100) {
  const token = useAuthStore((state) => state.token)
  return useQuery({
    queryKey: [PAYMENT_QUERY_KEYS.payments, page, size],
    queryFn: async () => {
      const api = getAuthenticatedApi(PaymentApi)
      const response = await api.getAllPayments({
        pageable: {
          page,
          size,
          sort: ['paidAt,desc'],
        },
      })

      try {
        const parsed = apiResponseListPaymentTableDTOSchema.parse(response)
        return parsed.data ?? []
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          throw new Error(`Payments response schema mismatch: ${zodIssueSummary(error)}`)
        }
        throw error
      }
    },
    enabled: !!token || (import.meta.env.DEV && isDebugBillingEnabled()),
    refetchOnMount: 'always',
    staleTime: 30000, // 30 seconds
  })
}

/**
 * Hook to fetch a single payment by ID
 */
export function usePayment(id: string | null) {
  const token = useAuthStore((state) => state.token)
  return useQuery({
    queryKey: [PAYMENT_QUERY_KEYS.payments, id],
    queryFn: async () => {
      if (!id) return null
      const api = getAuthenticatedApi(PaymentApi)
      const response = await api.getPayment({ id })

      try {
        const parsed = apiResponsePaymentTableDTOSchema.parse(response)
        return parsed.data ?? null
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          throw new Error(`Payment response schema mismatch: ${zodIssueSummary(error)}`)
        }
        throw error
      }
    },
    enabled: !!id && (!!token || (import.meta.env.DEV && isDebugBillingEnabled())),
    refetchOnMount: 'always',
    staleTime: 30000,
  })
}

/**
 * Hook to fetch all payment methods
 */
export function usePaymentMethods(page: number = 0, size: number = 50) {
  const token = useAuthStore((state) => state.token)
  return useQuery({
    queryKey: [PAYMENT_QUERY_KEYS.paymentMethods, page, size],
    queryFn: async () => {
      const api = getAuthenticatedApi(PaymentApi)
      const response = await api.getAllPaymentMethods({
        pageable: {
          page,
          size,
          sort: ['name,asc'],
        },
      })

      try {
        const parsed = apiResponseListPaymentMethodTableDTOSchema.parse(response)
        return parsed.data ?? []
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          throw new Error(`Payment methods response schema mismatch: ${zodIssueSummary(error)}`)
        }
        throw error
      }
    },
    enabled: !!token || (import.meta.env.DEV && isDebugBillingEnabled()),
    refetchOnMount: 'always',
    staleTime: 60000, // 1 minute
  })
}

/**
 * Hook to fetch all invoices with pagination
 */
export function useInvoices(page: number = 0, size: number = 200) {
  const token = useAuthStore((state) => state.token)
  return useQuery({
    queryKey: [PAYMENT_QUERY_KEYS.paymentInvoices, page, size],
    queryFn: async () => {
      const api = getAuthenticatedApi(InvoiceApi)
      const response = await api.getAllInvoices({
        pageable: {
          page,
          size,
          sort: ['issuedAt,desc'],
        },
      })

      try {
        const parsed = apiResponseListInvoiceTableDTOSchema.parse(response)
        return parsed.data ?? []
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          throw new Error(`Invoices response schema mismatch: ${zodIssueSummary(error)}`)
        }
        throw error
      }
    },
    enabled: !!token || (import.meta.env.DEV && isDebugBillingEnabled()),
    refetchOnMount: 'always',
    staleTime: 30000,
  })
}

export interface PaymentWithDetails extends PaymentTableDTO {
  invoice?: InvoiceTableDTO
  paymentMethod?: PaymentMethodTableDTO
  memberName?: string
  description?: string
}


export function mapPaymentStatus(
  payment: PaymentTableDTO,
  invoice?: InvoiceTableDTO
): 'paid' | 'failed' | 'overdue' | 'upcoming' {

  if (payment.paidAt) {
    return 'paid'
  }

  if (payment.failureReason) {
    return 'failed'
  }


  if (invoice) {
    if (invoice.status === 'OVERDUE') {
      return 'overdue'
    }
    if (invoice.status === 'ISSUED') {
      const dueDate = new Date(invoice.dueDate)
      const now = new Date()
      if (dueDate < now) {
        return 'overdue'
      }
      return 'upcoming'
    }
  }


  return 'upcoming'
}

export function formatPaymentAmount(amountCents: number, currency: string = 'PHP'): string {
  const amount = amountCents / 100
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
  }).format(amount)
}
