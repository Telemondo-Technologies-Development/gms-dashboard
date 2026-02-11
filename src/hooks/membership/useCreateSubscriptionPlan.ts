import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { SubscriptionApi } from '@/api/generated/apis/SubscriptionApi'
import { SubscriptionAvailedApi } from '@/api/generated/apis/SubscriptionAvailedApi'
import { getAuthenticatedApi } from '@/lib/api-client'
import { subscriptionAvailedQueryKeys } from '@/lib/QueryKeys'
import {
  apiResponseSubscriptionAvailedTableDTOSchema,
  apiResponseSubscriptionTableDTOSchema,
  subscriptionAvailedPostSchema,
  subscriptionPostSchema,
  type SubscriptionAvailedTableDTOParsed,
} from '@/types/membership/subscriptionSchemas'

interface UseCreateSubscriptionPlanOptions {
  createdById: string | null
  onCreated?: (plan: SubscriptionAvailedTableDTOParsed) => void
}

interface UseCreateSubscriptionPlanResult {
  formState: SubscriptionPlanFormState
  setFormState: React.Dispatch<React.SetStateAction<SubscriptionPlanFormState>>
  submitError: string | null
  isSubmitting: boolean
  handleSubmit: () => Promise<void>
  reset: () => void
}

interface SubscriptionPlanFormState {
  name: string
  description: string
  amount: string
  billingCycleId: string
}

const defaultFormState: SubscriptionPlanFormState = {
  name: '',
  description: '',
  amount: '',
  billingCycleId: '',
}

export function useCreateSubscriptionPlan(
  options: UseCreateSubscriptionPlanOptions,
): UseCreateSubscriptionPlanResult {
  const { createdById, onCreated } = options
  const [formState, setFormState] = useState<SubscriptionPlanFormState>(defaultFormState)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const subscriptionApi = getAuthenticatedApi(SubscriptionApi)
  const subscriptionAvailedApi = getAuthenticatedApi(SubscriptionAvailedApi)

  const mutation = useMutation({
    mutationFn: async () => {
      if (!createdById) {
        throw new Error('Missing user id. Please sign in again.')
      }

      const validated = subscriptionPostSchema.parse({
        createdById,
        name: formState.name.trim(),
        description: formState.description.trim(),
        amount: formState.amount,
        billingCycleId: formState.billingCycleId,
      })

      const subscriptionResponse = await subscriptionApi.createSubscription({
        subscriptionPostDTO: validated,
      })
      const subscriptionParsed = apiResponseSubscriptionTableDTOSchema.parse(subscriptionResponse)
      if (!subscriptionParsed.success || !subscriptionParsed.data) {
        throw new Error(subscriptionParsed.message ?? 'Failed to create subscription plan.')
      }

      const availedPayload = subscriptionAvailedPostSchema.parse({
        subscriptionId: subscriptionParsed.data.id,
      })

      const availedResponse = await subscriptionAvailedApi.createSubscriptionAvailed({
        subscriptionAvailedPostDTO: availedPayload,
      })
      const availedParsed = apiResponseSubscriptionAvailedTableDTOSchema.parse(availedResponse)
      if (!availedParsed.success || !availedParsed.data) {
        throw new Error(availedParsed.message ?? 'Failed to activate subscription plan.')
      }

      return availedParsed.data
    },
    onSuccess: (data) => {
      setSubmitError(null)
      void queryClient.invalidateQueries({ queryKey: [subscriptionAvailedQueryKeys.subscriptionAvailed] })
      onCreated?.(data)
    },
    onError: (error) => {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create subscription plan.')
    },
  })

  const handleSubmit = async () => {
    setSubmitError(null)
    await mutation.mutateAsync()
  }

  const reset = () => {
    setFormState(defaultFormState)
    setSubmitError(null)
  }

  return {
    formState,
    setFormState,
    submitError,
    isSubmitting: mutation.isPending,
    handleSubmit,
    reset,
  }
}