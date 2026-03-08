import { useEffect, useMemo, useState } from 'react'
import { useForm, type ReactFormExtendedApi } from '@tanstack/react-form'
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import type { FormAsyncValidateOrFn, FormValidateOrFn } from '@tanstack/form-core'

import { MemberSubscriptionApi } from '@/api/generated/apis/MemberSubscriptionApi'
import { MemberApi } from '@/api/generated/apis/MemberApi'
import { SubscriptionApi } from '@/api/generated/apis/SubscriptionApi'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import { getAuthenticatedApi } from '@/lib/api-client'
import { ResponseError } from '@/api/generated/runtime'
import { useAddMemberDialogData } from '@/hooks/membership/useMembershipDetails'
import { useBillingActions } from '@/hooks/billing/usePaymentHistoryBillingActions'
import { memberQueryKeys } from '@/lib/QueryKeys'
import {
  getMembershipApiErrorMessage,
  memberPostDtoSchema,
} from '@/types/membership/MembershipManagementSchema'
import type { MemberFormValues } from '@/types/membership/MembershipManagementSchema'
import { useCreateSubscriptionPlan } from '@/hooks/membership/useMembershipAddSubscriptionPlan'
import { useCreatePaymentMethod } from '@/hooks/billing/usePaymentHistoryAddMethods'
import type { SubscriptionPlanFormState } from '@/types/membership/MembershipsubscriptionSchemas'

const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)
const memberApi = getAuthenticatedApi(MemberApi)
const subscriptionApi = getAuthenticatedApi(SubscriptionApi)

interface UseAddMemberDialogResult {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submitError: string | null
  form: MemberFormApi
  startDate: Date | undefined
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  endDate: Date | undefined
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  selectedSubscriptionId: string
  setSelectedSubscriptionId: React.Dispatch<React.SetStateAction<string>>
  paymentMethodId: string
  setPaymentMethodId: React.Dispatch<React.SetStateAction<string>>
  paymentReferenceNum: string
  setPaymentReferenceNum: React.Dispatch<React.SetStateAction<string>>
  membershipDetails: string
  setMembershipDetails: React.Dispatch<React.SetStateAction<string>>
  selectedSubscription: SubscriptionAvailedTableDTO | undefined
  totalCost: string
  currentUserQuery: ReturnType<typeof useAddMemberDialogData>['currentUserQuery']
  currentUserEmail: string
  subscriptionsQuery: ReturnType<typeof useAddMemberDialogData>['subscriptionsQuery']
  createMemberMutation: UseMutationResult<unknown, Error, { values: MemberFormValues; skipBilling: boolean }, unknown>
  submitMemberOnly: () => Promise<void>
  
  // New props for inline creation
  newSubscriptionForm: {
    state: SubscriptionPlanFormState
    setState: React.Dispatch<React.SetStateAction<SubscriptionPlanFormState>>
    error: string | null
  }
  newPaymentMethodForm: {
    name: string
    setName: React.Dispatch<React.SetStateAction<string>>
    error: string | null
    reset: () => void
  }
}

export function useAddMemberDialog(): UseAddMemberDialogResult {
  const [open, setOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const queryClient = useQueryClient()
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState('')
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [paymentReferenceNum, setPaymentReferenceNum] = useState('')
  const [membershipDetails, setMembershipDetails] = useState('')

  const {
    currentUserQuery,
    resolvedActorId,
    currentUserEmail,
    branchPersonnelQuery,
    subscriptionsQuery,
    selectedBranchId,
  } = useAddMemberDialogData({ open })

  const { ensureInvoiceForSubscription, createPaymentIfNeeded } = useBillingActions()

  // Use hooks for inline creation
  const createSubscriptionPlan = useCreateSubscriptionPlan({
    createdById: resolvedActorId ?? null,
    onCreated: (_sub) => {
      // Typically handled in mutation flow, but can be used for side effects
    },
  })

  const createPaymentMethod = useCreatePaymentMethod({
    createdById: resolvedActorId ?? null,
    onCreated: (_method) => {
      // Typically handled in mutation flow
    },
  })

  const defaultValues: MemberFormValues = {
    createdById: '',
    firstName: '',
    middleName: '',
    surname: '',
    suffix: '',
    profilePictureId: '',
    status: 'ACTIVE',
  }

  const selectedSubscription = useMemo(
    () => {
      if (selectedSubscriptionId === 'new_subscription') {
        const amount = parseFloat(createSubscriptionPlan.formState.amount)
        return {
          id: 'new_subscription',
          name: createSubscriptionPlan.formState.name || 'New Subscription',
          amount: isNaN(amount) ? 0 : amount,
          gracePeriodDays: 0,
          intervalCount: 0,
          intervals: 'MONTHLY' as const,
        } satisfies SubscriptionAvailedTableDTO
      }
      return subscriptionsQuery.data?.find((s) => s.id === selectedSubscriptionId)
    },
    [subscriptionsQuery.data, selectedSubscriptionId, createSubscriptionPlan.formState, resolvedActorId],
  )

  const totalCost = useMemo(() => {
    const amount = selectedSubscription?.amount ?? 0
    return amount.toFixed(2)
  }, [selectedSubscription])

  const createMemberMutation = useMutation({
    mutationFn: async ({ values, skipBilling }: { values: MemberFormValues; skipBilling: boolean }) => {
      const createdById = values.createdById.trim()
      if (!createdById) {
        throw new Error('Missing actor id for the current user. Please log in again or ask admin to create an actor record.')
      }

      // Handle new subscription creation if needed
      // NOTE: subscriptionIdToUse must be the base Subscription ID (not availed ID)
      // because MemberSubscriptionPostDTO.subscriptionId expects the base Subscription ID.
      let subscriptionIdToUse: string | undefined
      // subscriptionAvailedIdToUse is the availed subscription ID needed for invoice creation
      let subscriptionAvailedIdToUse: string | undefined

      if (selectedSubscriptionId === 'new_subscription') {
        try {
          if (!createSubscriptionPlan.formState.name) throw new Error('Subscription name is required')
          if (!createSubscriptionPlan.formState.amount) throw new Error('Subscription amount is required')
          if (!createSubscriptionPlan.formState.billingCycleId) throw new Error('Billing cycle is required')

          const newPlan = await createSubscriptionPlan.handleSubmit()
          subscriptionIdToUse = newPlan.rawSubscriptionId
          subscriptionAvailedIdToUse = newPlan.id
        } catch (error) {
          throw new Error(`Failed to create new subscription: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      } else if (selectedSubscriptionId) {
        subscriptionAvailedIdToUse = selectedSubscriptionId
        // For existing selections: look up the raw Subscription ID via name/amount match
        // because the dropdown shows availed IDs but the API needs the base Subscription ID.
        try {
          const subsResp = await subscriptionApi.getAllSubscriptions({ pageable: { page: 0, size: 500 } })
          const availed = subscriptionsQuery.data?.find((s) => s.id === selectedSubscriptionId)
          if (availed) {
            const match = (subsResp.data ?? []).find(
              (s) => s.name.trim().toLowerCase() === availed.name.trim().toLowerCase() && s.amount === availed.amount,
            )
            subscriptionIdToUse = match?.id ?? selectedSubscriptionId
          } else {
            subscriptionIdToUse = selectedSubscriptionId
          }
        } catch {
          console.warn('Failed to look up raw subscription id; falling back to availed id')
          subscriptionIdToUse = selectedSubscriptionId
        }
      }

      if (!skipBilling && !subscriptionIdToUse) {
        throw new Error('Please select a subscription plan.')
      }

      if (!skipBilling && !startDate) {
        throw new Error('Please select a start date.')
      }

      // Handle new payment method creation if needed
      let paymentMethodToUse = paymentMethodId
      if (!skipBilling && paymentMethodToUse === 'new_payment_method') {
        try {
          if (!createPaymentMethod.name) throw new Error('Payment method name is required')
          const newMethod = await createPaymentMethod.handleSubmit()
          paymentMethodToUse = newMethod.id
        } catch (error) {
          throw new Error(`Failed to create new payment method: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }

      const branchId = branchPersonnelQuery.data?.branchId ?? selectedBranchId
      if (!branchId) {
        throw new Error('User branch not found. Please ensure you are assigned to a branch.')
      }

      const memberPostDTO = memberPostDtoSchema.parse({
        createdById,
        firstName: values.firstName.trim(),
        middleName: values.middleName.trim() || undefined,
        profilePictureId: values.profilePictureId.trim() || undefined,
        surname: values.surname.trim(),
        suffix: values.suffix.trim() || undefined,
        status: values.status,
      })

      let createResponse: Awaited<ReturnType<typeof memberApi.createMember>>
      try {
        createResponse = await memberApi.createMember({ memberPostDTO })
      } catch (error) {
        if (error instanceof ResponseError) {
          const body = await error.response.text().catch(() => '')
          if (error.response.status === 409 || body.includes('VAL_009') || body.includes('members.uk_name')) {
            throw new Error('A member with this name already exists. Please review the name details or edit the existing member record.')
          }
          let parsed: unknown = null
          try { parsed = body.trim() ? JSON.parse(body) : null } catch { /* ignore */ }
          throw new Error(getMembershipApiErrorMessage(parsed, `Create member failed (${error.response.status}).`))
        }
        throw error
      }

      if (!createResponse.success) {
        throw new Error(createResponse.message ?? 'Failed to create member.')
      }

      const member = createResponse.data
      if (!member) throw new Error('Failed to create member: no data returned.')

      if (skipBilling) {
        return member
      }

      let memberActorId = member.actorId
      if (!memberActorId) {
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const refreshed = await memberApi.getMember({ id: member.id })
            if (refreshed.success && refreshed.data?.actorId) {
              memberActorId = refreshed.data.actorId
              break
            }
          } catch {
            // Retry on error
          }
          await new Promise((r) => setTimeout(r, 400))
        }
      }
      const effectiveMemberActorId = memberActorId ?? member.id

      let createdMemberSubscriptionId: string | undefined
      let createdInvoiceId: string | undefined
      try {
        const subEnvelope = await memberSubscriptionApi.createMemberSubscription({
          memberSubscriptionPostDTO: {
            actorId: effectiveMemberActorId,
            branchId,
            createdById,
            startDate: startDate!,
            endDate,
            status: 'ACTIVE',
            subscriptionId: subscriptionIdToUse!,
          },
        })
        if (!subEnvelope.success || !subEnvelope.data) {
          throw new Error(subEnvelope.message ?? 'Failed to create subscription.')
        }
        createdMemberSubscriptionId = subEnvelope.data.id

        let amountToCharge = 0
        let gracePeriod = 0

        if (selectedSubscriptionId === 'new_subscription') {
          amountToCharge = parseFloat(createSubscriptionPlan.formState.amount)
          gracePeriod = 0
        } else if (selectedSubscription) {
          amountToCharge = selectedSubscription.amount
          gracePeriod = selectedSubscription.gracePeriodDays ?? 0
        }
        
        if (createdMemberSubscriptionId && subscriptionAvailedIdToUse) {
          const effectiveStartDate = startDate!
          const intervals = selectedSubscription?.intervals ?? 'MONTHLY'
          const intervalCount = selectedSubscription?.intervalCount ?? 1

          createdInvoiceId = await ensureInvoiceForSubscription({
            actorId: effectiveMemberActorId,
            branchId,
            createdById,
            memberSubscriptionId: createdMemberSubscriptionId,
            subscriptionAvailedId: subscriptionAvailedIdToUse,
            startDate: effectiveStartDate,
            intervals,
            intervalCount,
            gracePeriodDays: gracePeriod,
            subtotal: amountToCharge,
          })
        }
      } catch (subError) {
        console.error('Failed to create subscription:', subError)
        throw new Error('Member created but failed to create subscription. Please add subscription manually.')
      }

      try {
        await createPaymentIfNeeded({
          paymentMethodId: paymentMethodToUse,
          invoiceId: createdInvoiceId,
          createdById,
          amount: selectedSubscription?.amount ?? 0,
          subtotal: selectedSubscription?.amount ?? 0,
          paidAt: new Date(),
          referenceNum: paymentReferenceNum,
        })
      } catch (payError) {
        console.warn('Payment creation skipped or failed:', payError)
      }

      return member
    },
    onSuccess: () => {
      setSubmitError(null)
      void queryClient.invalidateQueries({ queryKey: [memberQueryKeys.members] })
      void queryClient.invalidateQueries({ queryKey: [memberQueryKeys.memberSubscriptions] })
    },
  })

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      if (!value.createdById.trim()) {
        setSubmitError('Current user actor id is missing. Cannot create member.')
        return
      }

      try {
        await createMemberMutation.mutateAsync({ values: value, skipBilling: false })
        setOpen(false)
        form.reset()
        setStartDate(undefined)
        setEndDate(undefined)
        setSelectedSubscriptionId('')
        setPaymentMethodId('')
        setPaymentReferenceNum('')
        setMembershipDetails('')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to create member.'
        setSubmitError(message)
      }
    },
  })

  const submitMemberOnly = async () => {
    setSubmitError(null)

    const values = form.state.values
    if (!values.createdById.trim()) {
      setSubmitError('Current user actor id is missing. Cannot create member.')
      return
    }

    if (!values.firstName.trim()) {
      setSubmitError('First name is required.')
      return
    }

    if (!values.surname.trim()) {
      setSubmitError('Surname is required.')
      return
    }

    try {
      await createMemberMutation.mutateAsync({ values, skipBilling: true })
      setOpen(false)
      form.reset()
      setStartDate(undefined)
      setEndDate(undefined)
      setSelectedSubscriptionId('')
      setPaymentMethodId('')
      setPaymentReferenceNum('')
      setMembershipDetails('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create member.'
      setSubmitError(message)
    }
  }

  useEffect(() => {
    if (resolvedActorId && form.state.values.createdById !== resolvedActorId) {
      form.setFieldValue('createdById', resolvedActorId)
    }
  }, [resolvedActorId])

  // Ensure createdById is set when dialog opens
  useEffect(() => {
    if (open && resolvedActorId && !form.state.values.createdById) {
      form.setFieldValue('createdById', resolvedActorId)
    }
  }, [open, resolvedActorId])

  return {
    open,
    setOpen,
    submitError,
    form,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedSubscriptionId,
    setSelectedSubscriptionId,
    paymentMethodId,
    setPaymentMethodId,
    paymentReferenceNum,
    setPaymentReferenceNum,
    membershipDetails,
    setMembershipDetails,
    selectedSubscription,
    totalCost,
    currentUserQuery,
    currentUserEmail,
    subscriptionsQuery,
    createMemberMutation,
    submitMemberOnly,
    newSubscriptionForm: {
      state: createSubscriptionPlan.formState,
      setState: createSubscriptionPlan.setFormState,
      error: createSubscriptionPlan.submitError,
    },
    newPaymentMethodForm: {
      name: createPaymentMethod.name,
      setName: createPaymentMethod.setName,
      error: createPaymentMethod.submitError,
      reset: createPaymentMethod.reset,
    },
  }
}

type MemberFormApi = ReactFormExtendedApi<
  MemberFormValues,
  MemberFormValidate,
  MemberFormValidate,
  MemberFormAsyncValidate,
  MemberFormValidate,
  MemberFormAsyncValidate,
  MemberFormValidate,
  MemberFormAsyncValidate,
  MemberFormValidate,
  MemberFormAsyncValidate,
  MemberFormAsyncValidate,
  unknown
>

type MemberFormValidate = FormValidateOrFn<MemberFormValues> | undefined
type MemberFormAsyncValidate = FormAsyncValidateOrFn<MemberFormValues> | undefined