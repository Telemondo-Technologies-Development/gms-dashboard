import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { MemberSubscriptionApi } from '@/api/generated/apis/MemberSubscriptionApi'
import type { SubscriptionAvailedTableDTO } from '@/api/generated/models/SubscriptionAvailedTableDTO'
import { usePaymentHistoryCreatePaymentMethod } from '@/hooks/billing/usePaymentHistoryCreateMethods'
import { usePaymentHistoryCreateActions } from '@/hooks/billing/usePaymentHistoryCreate'
import { useAddMemberDialogData } from '@/hooks/membership/useMembershipDetails'
import { useCreateSubscriptionPlan } from '@/hooks/membership/useMembershipCreateSubscriptionPlan'
import { useMemberDetailsDialogData } from '@/hooks/membership/useMembershipCreationContext'
import { useMembershipUpdateSubscription } from '@/hooks/membership/useMembershipUpdateMember'
import { isAdminSession } from '@/lib/auth/auth-permissions'
import { useAuthSession } from '@/lib/auth/auth-session'
import { calculateNextDueDate } from '@/lib/billing-utils'
import { invoiceQueryKeys, memberQueryKeys, paymentQueryKeys, subscriptionAvailedQueryKeys } from '@/lib/QueryKeys'
import {
  toMembershipErrorMessage,
  type MemberDetailsDialogProps,
  type MemberInfo,
} from '@/types/membership/MembershipManagementSchema'

type UseMembershipDetailsDialogOptions = Pick<MemberDetailsDialogProps, 'open' | 'memberGroup'> & {
  onClose: () => void
}

export function useMembershipDetailsDialog(options: UseMembershipDetailsDialogOptions) {
  const { open, memberGroup, onClose } = options

  const [members, setMembers] = useState<MemberInfo[]>([])
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState('')
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [paymentReferenceNum, setPaymentReferenceNum] = useState('')
  const [membershipDetails, setMembershipDetails] = useState('')
  const [currentMemberSubscriptionId, setCurrentMemberSubscriptionId] = useState<string | undefined>(undefined)

  const queryClient = useQueryClient()
  const session = useAuthSession()
  const { resolvedActorId, selectedBranchId } = useAddMemberDialogData({ open })

  const createSubscriptionPlan = useCreateSubscriptionPlan({
    createdById: session.actorId ?? null,
    onCreated: (item) => {
      setSelectedSubscriptionId(item.id)
      createSubscriptionPlan.reset()
    },
  })

  const createPaymentMethod = usePaymentHistoryCreatePaymentMethod({
    createdById: session.actorId ?? null,
  })

  const memberActorId = memberGroup?.actorId ?? memberGroup?.id ?? null

  const isAdmin = useMemo(
    () => isAdminSession({ token: session.token, roles: session.roles }),
    [session.token, session.roles],
  )

  const { ensureInvoiceForSubscription, createPaymentIfNeeded } = usePaymentHistoryCreateActions()

  const { subscriptionsQuery, memberSubscriptionQuery } = useMemberDetailsDialogData({
    open,
    memberActorId,
  })

  const hasActiveSubscription = !!memberSubscriptionQuery.data
  const canEditBilling = !hasActiveSubscription || isAdmin

  const selectedSubscription = subscriptionsQuery.data?.find(
    (subscription: SubscriptionAvailedTableDTO) => subscription.id === selectedSubscriptionId,
  )

  useEffect(() => {
    if (!memberGroup) return

    setMembers(memberGroup.members)
    setStartDate(memberGroup.startDate ?? (memberSubscriptionQuery.data ? undefined : new Date()))
    setEndDate(memberGroup.endDate)
    setPaymentMethodId('')
    setPaymentReferenceNum('')
    setMembershipDetails(memberGroup.membershipDetails)

    if (memberSubscriptionQuery.data) {
      setCurrentMemberSubscriptionId(memberSubscriptionQuery.data.id)
      if (memberSubscriptionQuery.data.startDate) {
        setStartDate(new Date(memberSubscriptionQuery.data.startDate))
      }
      if (memberSubscriptionQuery.data.endDate) {
        setEndDate(new Date(memberSubscriptionQuery.data.endDate))
      }

      if (memberSubscriptionQuery.data.subscriptionAvailedId) {
        setSelectedSubscriptionId(memberSubscriptionQuery.data.subscriptionAvailedId)
      }
    }
  }, [memberGroup, memberSubscriptionQuery.data])

  const totalCost = useMemo(() => {
    const amount = selectedSubscription?.amount ?? 0
    return (amount * Math.max(1, members.length)).toFixed(2)
  }, [selectedSubscription, members.length])

  const updateSubscriptionMutation = useMembershipUpdateSubscription()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!memberGroup) return

    try {
      let subscriptionResult: { memberSubscriptionId?: string; createdById?: string } | undefined
      if (canEditBilling && selectedSubscriptionId && startDate) {
        const memberSubscription = memberSubscriptionQuery.data
        if (!selectedSubscriptionId) {
          throw new Error('Please select a subscription plan.')
        }

        subscriptionResult = await updateSubscriptionMutation.mutateAsync({
          memberGroupId: memberGroup.id,
          memberActorId,
          currentMemberSubscriptionId,
          selectedSubscriptionId,
          startDate,
          endDate,
          selectedBranchId,
          branchId: memberSubscription?.branchId,
          createdById: memberSubscription?.createdById,
          updatedById: memberSubscription?.updatedById || memberSubscription?.createdById || resolvedActorId || null,
          selectedSubscriptionName: selectedSubscription?.name,
          selectedSubscriptionAmount: selectedSubscription?.amount,
        })
      }

      let ensuredInvoiceId: string | undefined
      try {
        if (!canEditBilling) {
          ensuredInvoiceId = undefined
        } else {
          const memberSubscriptionId = subscriptionResult?.memberSubscriptionId ?? currentMemberSubscriptionId
          const createdById = subscriptionResult?.createdById ?? memberSubscriptionQuery.data?.createdById
          const branchId = memberSubscriptionQuery.data?.branchId ?? selectedBranchId

          if (memberSubscriptionId && selectedSubscription && createdById && branchId) {
            const effectiveStartDate = startDate ?? new Date()
            const actorId = memberActorId ?? memberGroup.id

            ensuredInvoiceId = await ensureInvoiceForSubscription({
              actorId,
              branchId,
              createdById,
              memberSubscriptionId,
              subscriptionAvailedId: selectedSubscriptionId,
              startDate: effectiveStartDate,
              intervals: selectedSubscription.intervals,
              intervalCount: selectedSubscription.intervalCount,
              gracePeriodDays: selectedSubscription.gracePeriodDays ?? 0,
              subtotal: selectedSubscription.amount,
            })
          }
        }
      } catch (invoiceError) {
        console.warn('Invoice creation skipped or failed:', invoiceError)
      }

      try {
        if (!canEditBilling) throw new Error('Billing locked')

        const memberSubscriptionId = subscriptionResult?.memberSubscriptionId ?? currentMemberSubscriptionId
        const createdById = subscriptionResult?.createdById ?? memberSubscriptionQuery.data?.createdById
        const branchId = memberSubscriptionQuery.data?.branchId ?? selectedBranchId

        let resolvedPaymentMethodId = paymentMethodId
        if (resolvedPaymentMethodId === 'new_payment_method') {
          if (!createPaymentMethod.name.trim()) throw new Error('Payment method name is required')
          const newMethod = await createPaymentMethod.handleSubmit()
          resolvedPaymentMethodId = newMethod.id
          createPaymentMethod.reset()
        }

        if (memberSubscriptionId && selectedSubscription && createdById && branchId) {
          await createPaymentIfNeeded({
            paymentMethodId: resolvedPaymentMethodId,
            invoiceId: ensuredInvoiceId,
            createdById,
            amount: selectedSubscription.amount,
            subtotal: selectedSubscription.amount,
            paidAt: new Date(),
            referenceNum: paymentReferenceNum,
            gracePeriodDays: selectedSubscription.gracePeriodDays ?? 0,
            knownDueDate: calculateNextDueDate(
              startDate ?? new Date(),
              selectedSubscription.intervals,
              selectedSubscription.intervalCount,
            ),
          })
        }
      } catch (paymentError) {
        if (!(paymentError instanceof Error && paymentError.message === 'Billing locked')) {
          console.warn('Payment creation skipped or failed:', paymentError)
        }
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [memberQueryKeys.members] }),
        queryClient.invalidateQueries({ queryKey: [memberQueryKeys.memberSubscriptions] }),
        queryClient.invalidateQueries({ queryKey: [invoiceQueryKeys.invoices] }),
        queryClient.invalidateQueries({ queryKey: [paymentQueryKeys.payments] }),
        queryClient.invalidateQueries({ queryKey: [subscriptionAvailedQueryKeys.subscriptionAvailed] }),
      ])

      await Promise.all([
        queryClient.refetchQueries({ queryKey: [memberQueryKeys.members], type: 'active' }),
        queryClient.refetchQueries({ queryKey: [memberQueryKeys.memberSubscriptions], type: 'active' }),
        queryClient.refetchQueries({ queryKey: [invoiceQueryKeys.invoices], type: 'active' }),
      ])

      onClose()
    } catch (error) {
      console.error('Failed to save member details:', error)
      alert(toMembershipErrorMessage(error, 'Failed to save changes'))
    }
  }

  return {
    members,
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
    subscriptionsQuery,
    canEditBilling,
    createSubscriptionPlan,
    createPaymentMethod,
    updateSubscriptionMutation,
    resolvedActorId,
    handleSubmit,
  }
}