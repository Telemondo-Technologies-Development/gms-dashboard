import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { PaymentApi } from '@/api/generated/apis/PaymentApi'
import { getAuthenticatedApi } from '@/lib/api-client'
import { paymentQueryKeys } from '@/lib/QueryKeys'
import {
  apiResponsePaymentMethodTableDTOSchema,
  paymentMethodPostSchema,
  type PaymentMethodTableDTOParsed,
} from '@/types/payment/paymentSchemas'

interface UseCreatePaymentMethodOptions {
  createdById: string | null
  onCreated?: (method: PaymentMethodTableDTOParsed) => void
}

interface UseCreatePaymentMethodResult {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  submitError: string | null
  isSubmitting: boolean
  handleSubmit: () => Promise<PaymentMethodTableDTOParsed>
  reset: () => void
}

export function useCreatePaymentMethod(
  options: UseCreatePaymentMethodOptions,
): UseCreatePaymentMethodResult {
  const { createdById, onCreated } = options
  const [name, setName] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const paymentApi = getAuthenticatedApi(PaymentApi)

  const mutation = useMutation({
    mutationFn: async () => {
      if (!createdById) {
        throw new Error('Missing user id. Please sign in again.')
      }
      const validated = paymentMethodPostSchema.parse({
        createdById,
        name: name.trim(),
      })
      const response = await paymentApi.createPaymentMethod({
        paymentMethodPostDTO: validated,
      })
      const parsed = apiResponsePaymentMethodTableDTOSchema.parse(response)
      if (!parsed.success || !parsed.data) {
        throw new Error(parsed.message ?? 'Failed to create payment method.')
      }
      return parsed.data
    },
    onSuccess: (data) => {
      setSubmitError(null)
      void queryClient.invalidateQueries({ queryKey: [paymentQueryKeys.paymentMethods] })
      onCreated?.(data)
    },
    onError: (error) => {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create payment method.')
    },
  })

  const handleSubmit = async () => {
    setSubmitError(null)
    return await mutation.mutateAsync()
  }

  const reset = () => {
    setName('')
    setSubmitError(null)
  }

  return {
    name,
    setName,
    submitError,
    isSubmitting: mutation.isPending,
    handleSubmit,
    reset,
  }
}

export const usePaymentHistoryCreatePaymentMethod = useCreatePaymentMethod