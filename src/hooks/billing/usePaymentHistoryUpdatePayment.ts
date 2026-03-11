import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { PaymentApi } from '@/api/generated/apis/PaymentApi'
import { getAuthenticatedApi } from '@/lib/api-client'
import { useAuthSession } from '@/lib/auth/auth-session'
import { usePaymentHistoryCreateActions } from '@/hooks/billing/usePaymentHistoryCreate'
import { invoiceQueryKeys, paymentQueryKeys } from '@/lib/QueryKeys'
import type {
	InvoiceTableDTOParsed,
	PaymentMethodTableDTOParsed,
	PaymentTableDTOParsed,
} from '@/types/payment/paymentSchemas'

export type PaymentHistoryUpdateDisplayStatus = 'paid' | 'failed' | 'pending'

interface UsePaymentHistoryUpdatePaymentInput {
	payment: PaymentTableDTOParsed | null
	invoice?: InvoiceTableDTOParsed
	paymentMethodMap: Map<string, PaymentMethodTableDTOParsed>
}

function mapDisplayStatus(payment: PaymentTableDTOParsed): PaymentHistoryUpdateDisplayStatus {
	if (payment.paidAt) return 'paid'
	if (payment.failureReason && payment.failureReason.trim().length > 0) return 'failed'
	return 'pending'
}

export function usePaymentHistoryUpdatePayment({
	payment,
	invoice,
	paymentMethodMap,
}: UsePaymentHistoryUpdatePaymentInput) {
	const session = useAuthSession()
	const queryClient = useQueryClient()
	const { createPaymentIfNeeded } = usePaymentHistoryCreateActions()

	const [markPaidMode, setMarkPaidMode] = useState(false)
	const [showMarkPaidAdminConfirm, setShowMarkPaidAdminConfirm] = useState(false)
	const [markPaidMethodId, setMarkPaidMethodId] = useState('')
	const [markPaidRefNum, setMarkPaidRefNum] = useState('')
	const [markPaidAt, setMarkPaidAt] = useState<Date | undefined>(undefined)
	const [markPaidError, setMarkPaidError] = useState<string | null>(null)

	const paymentMethodOptions = useMemo(
		() => Array.from(paymentMethodMap.values()).sort((left, right) => left.name.localeCompare(right.name)),
		[paymentMethodMap],
	)

	const currentDisplayStatus = payment ? mapDisplayStatus(payment) : null

	const isCashMethod = (id: string) => /cash/i.test(paymentMethodMap.get(id)?.name ?? '')

	const resetState = useCallback(() => {
		setMarkPaidMode(false)
		setShowMarkPaidAdminConfirm(false)
		setMarkPaidMethodId('')
		setMarkPaidRefNum('')
		setMarkPaidAt(undefined)
		setMarkPaidError(null)
	}, [])

	const primeForm = () => {
		setMarkPaidMethodId(payment?.paymentMethodId ?? '')
		setMarkPaidRefNum('')
		setMarkPaidAt(undefined)
		setMarkPaidError(null)
	}

	const markAsPaidMutation = useMutation({
		mutationFn: async () => {
			if (!payment) throw new Error('No payment selected.')
			if (!session.actorId) throw new Error('Missing actor ID for current user.')
			if (!markPaidMethodId) throw new Error('Payment method is required.')

			const isOnline = !isCashMethod(markPaidMethodId)
			if (isOnline && !markPaidRefNum.trim()) {
				throw new Error('Reference number is required for online payments.')
			}

			const paymentApi = getAuthenticatedApi(PaymentApi)
			const response = await paymentApi.updatePayment({
				id: payment.id,
				paymentPutDTO: {
					amount: payment.amount,
					paymentMethodId: markPaidMethodId,
					status: 'FULL',
					updatedById: session.actorId,
					paidAt: markPaidAt ?? new Date(),
					failureReason: undefined,
				},
			})

			if (!response.success || !response.data) {
				throw new Error(response.message ?? 'Failed to mark payment as paid.')
			}

			return response.data
		},
		onSuccess: () => {
			resetState()
			void queryClient.invalidateQueries({ queryKey: [paymentQueryKeys.payments] })
			void queryClient.invalidateQueries({ queryKey: [invoiceQueryKeys.invoices] })
		},
		onError: (error: unknown) => {
			setMarkPaidError(error instanceof Error ? error.message : 'Failed to mark as paid.')
		},
	})

	const createAsPaidMutation = useMutation({
		mutationFn: async () => {
			if (!invoice) throw new Error('No invoice selected.')
			if (!session.actorId) throw new Error('Missing actor ID for current user.')
			if (!markPaidMethodId) throw new Error('Payment method is required.')

			const isOnline = !isCashMethod(markPaidMethodId)
			if (isOnline && !markPaidRefNum.trim()) {
				throw new Error('Reference number is required for online payments.')
			}

			const invoiceAmount = invoice.subtotal > 0 ? invoice.subtotal : invoice.total

			await createPaymentIfNeeded({
				invoiceId: invoice.id,
				amount: invoiceAmount,
				subtotal: invoiceAmount,
				paymentMethodId: markPaidMethodId,
				referenceNum: markPaidRefNum.trim() || undefined,
				createdById: session.actorId,
				paidAt: markPaidAt ?? new Date(),
				knownDueDate: invoice.dueDate ?? undefined,
			})
		},
		onSuccess: () => {
			resetState()
		},
		onError: (error: unknown) => {
			setMarkPaidError(error instanceof Error ? error.message : 'Failed to create payment.')
		},
	})

	const activeMutation = payment ? markAsPaidMutation : createAsPaidMutation

	const openForm = () => {
		primeForm()
		setMarkPaidMode(true)
	}

	const requestOpenForm = () => {
		if (currentDisplayStatus === 'paid') {
			setShowMarkPaidAdminConfirm(true)
			return
		}

		openForm()
	}

	const confirmOverride = () => {
		primeForm()
		setMarkPaidMode(true)
		setShowMarkPaidAdminConfirm(false)
	}

	const closeForm = () => {
		setMarkPaidMode(false)
		setMarkPaidError(null)
	}

	const submit = async () => {
		await activeMutation.mutateAsync()
	}

	const canSubmit =
		!!markPaidMethodId &&
		(isCashMethod(markPaidMethodId) || !!markPaidRefNum.trim()) &&
		!activeMutation.isPending

	return {
		currentDisplayStatus,
		markPaidMode,
		markPaidMethodId,
		markPaidRefNum,
		markPaidAt,
		markPaidError,
		paymentMethodOptions,
		showMarkPaidAdminConfirm,
		isPending: activeMutation.isPending,
		canSubmit,
		isCashMethod,
		requestOpenForm,
		confirmOverride,
		closeForm,
		resetState,
		submit,
		setMarkPaidMethodId,
		setMarkPaidRefNum,
		setMarkPaidAt,
		setShowMarkPaidAdminConfirm,
	}
}
