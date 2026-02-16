import { useEffect, useMemo, useState } from 'react'
import { useForm, type ReactFormExtendedApi } from '@tanstack/react-form'
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import type { FormAsyncValidateOrFn, FormValidateOrFn } from '@tanstack/form-core'

import { MemberSubscriptionApi } from '@/api/generated/apis/MemberSubscriptionApi'
import { MemberApi } from '@/api/generated/apis/MemberApi'
import { SubscriptionApi } from '@/api/generated/apis/SubscriptionApi'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import { getAuthenticatedApi } from '@/lib/api-client'
import { useAddMemberDialogData } from '@/hooks/membership/useAddMemberData'
import { useBillingActions } from '@/hooks/billing/useBillingActions'
import { memberQueryKeys } from '@/lib/QueryKeys'
import { apiResponseMemberTableSchema, memberPostDtoSchema } from '@/types/membership/memberSchemas'
import type { MemberFormValues } from '@/types/membership/memberSchemas'

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
  membershipDetails: string
  setMembershipDetails: React.Dispatch<React.SetStateAction<string>>
  selectedSubscription: SubscriptionAvailedTableDTO | undefined
  totalCost: string
  currentUserQuery: ReturnType<typeof useAddMemberDialogData>['currentUserQuery']
  currentUserEmail: string
  subscriptionsQuery: ReturnType<typeof useAddMemberDialogData>['subscriptionsQuery']
  createMemberMutation: UseMutationResult<unknown, Error, MemberFormValues, unknown>
}

export function useAddMemberDialog(): UseAddMemberDialogResult {
  const [open, setOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const queryClient = useQueryClient()
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState('')
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [membershipDetails, setMembershipDetails] = useState('')

  const {
    token,
    currentUserQuery,
    resolvedActorId,
    currentUserEmail,
    branchPersonnelQuery,
    subscriptionsQuery,
    selectedBranchId,
  } = useAddMemberDialogData({ open })

  const { ensureInvoiceForSubscription, createPaymentIfNeeded } = useBillingActions()

  const memberSubscriptionApi = getAuthenticatedApi(MemberSubscriptionApi)
  const subscriptionApi = getAuthenticatedApi(SubscriptionApi)
  const memberApi = getAuthenticatedApi(MemberApi)

  const defaultValues: MemberFormValues = {
    createdById: '',
    firstName: '',
    middleName: '',
    surname: '',
    suffix: '',
    profilePictureId: '',
    status: 'IN',
  }

  const selectedSubscription = useMemo(
    () => subscriptionsQuery.data?.find((s) => s.id === selectedSubscriptionId),
    [subscriptionsQuery.data, selectedSubscriptionId],
  )

  const totalCost = useMemo(() => {
    const amount = selectedSubscription?.amount ?? 0
    return amount.toFixed(2)
  }, [selectedSubscription])

  const createMemberMutation = useMutation({
    mutationFn: async (values: MemberFormValues) => {
      const createdById = values.createdById.trim()
      if (!createdById) {
        throw new Error('Missing actor id for the current user. Please log in again or ask admin to create an actor record.')
      }

      if (!selectedSubscriptionId) {
        throw new Error('Please select a subscription plan.')
      }

      if (!startDate) {
        throw new Error('Please select a start date.')
      }

      const branchId = branchPersonnelQuery.data?.branchId ?? selectedBranchId
      if (!branchId) {
        throw new Error('User branch not found. Please ensure you are assigned to a branch.')
      }

      const memberPostDTO = {
        createdById,
        firstName: values.firstName.trim(),
        middleName: values.middleName.trim() || undefined,
        profilePictureId: values.profilePictureId.trim() || undefined,
        surname: values.surname.trim(),
        suffix: values.suffix.trim() || undefined,
        status: values.status,
      }

      const validated = memberPostDtoSchema.parse(memberPostDTO)

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
      const base = import.meta.env.DEV ? '' : (apiBaseUrl || '')
      const response = await fetch(`${base}/api/member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(validated),
      })

      const rawText = await response.text().catch(() => '')
      if (!response.ok) {
        throw new Error(`Create member failed (${response.status}). ${rawText || 'Check server logs for details.'}`)
      }

      const parsedJson: unknown = rawText.trim() ? JSON.parse(rawText) : null
      const envelope = apiResponseMemberTableSchema.parse(parsedJson)
      if (!envelope.success) {
        throw new Error(envelope.message ?? 'Failed to create member.')
      }

      const member = envelope.data

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
        let subscriptionIdToUse: string = selectedSubscriptionId
        if (selectedSubscription) {
          try {
            const subsResp = await subscriptionApi.getAllSubscriptions({ pageable: { page: 0, size: 500 } })
            const match = (subsResp.data ?? []).find(
              (s) => s.name.trim().toLowerCase() === selectedSubscription.name.trim().toLowerCase() && s.amount === selectedSubscription.amount,
            )
            if (match) subscriptionIdToUse = match.id
          } catch {
            console.warn('Failed to map subscription; using selected id')
          }
        }
        const subEnvelope = await memberSubscriptionApi.createMemberSubscription({
          memberSubscriptionPostDTO: {
            actorId: effectiveMemberActorId,
            branchId,
            createdById,
            startDate,
            endDate,
            status: 'ACTIVE',
            subscriptionId: subscriptionIdToUse,
          },
        })
        if (!subEnvelope.success || !subEnvelope.data) {
          throw new Error(subEnvelope.message ?? 'Failed to create subscription.')
        }
        createdMemberSubscriptionId = subEnvelope.data.id

        if (createdMemberSubscriptionId && selectedSubscription) {
          const dueDate = startDate ?? new Date()
          createdInvoiceId = await ensureInvoiceForSubscription({
            actorId: effectiveMemberActorId,
            branchId,
            createdById,
            memberSubscriptionId: createdMemberSubscriptionId,
            subscriptionAvailedId: selectedSubscriptionId,
            dueDate,
            gracePeriodDays: selectedSubscription.gracePeriodDays ?? 0,
            subtotal: selectedSubscription.amount,
          })
        }
      } catch (subError) {
        console.error('Failed to create subscription:', subError)
        throw new Error('Member created but failed to create subscription. Please add subscription manually.')
      }

      try {
        await createPaymentIfNeeded({
          paymentMethodId,
          invoiceId: createdInvoiceId,
          createdById,
          amount: selectedSubscription?.amount ?? 0,
          paidAt: new Date(),
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
        await createMemberMutation.mutateAsync(value)
        setOpen(false)
        form.reset()
        setStartDate(undefined)
        setEndDate(undefined)
        setSelectedSubscriptionId('')
        setPaymentMethodId('')
        setMembershipDetails('')
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to create member.'
        setSubmitError(message)
      }
    },
  })

  useEffect(() => {
    if (!resolvedActorId) return
    const current = form.state.values.createdById
    if (current !== resolvedActorId) {
      form.setFieldValue('createdById', resolvedActorId)
    }
  }, [resolvedActorId, form])

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
    membershipDetails,
    setMembershipDetails,
    selectedSubscription,
    totalCost,
    currentUserQuery,
    currentUserEmail,
    subscriptionsQuery,
    createMemberMutation,
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