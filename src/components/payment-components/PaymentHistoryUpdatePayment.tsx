import { format } from 'date-fns'
import { CheckCircle2, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EditAdminConfirmDialog } from '@/components/common/EditAdminConfirm'
import { usePaymentHistoryUpdatePayment } from '@/hooks/billing/usePaymentHistoryUpdatePayment'

interface PaymentHistoryUpdatePaymentTriggerProps {
	controller: ReturnType<typeof usePaymentHistoryUpdatePayment>
	isEditing: boolean
}

interface PaymentHistoryUpdatePaymentFormProps {
	controller: ReturnType<typeof usePaymentHistoryUpdatePayment>
}

interface PaymentHistoryUpdatePaymentAdminConfirmProps {
	controller: ReturnType<typeof usePaymentHistoryUpdatePayment>
}

export function PaymentHistoryUpdatePaymentTrigger({
	controller,
	isEditing,
}: PaymentHistoryUpdatePaymentTriggerProps) {
	if (controller.markPaidMode || isEditing) {
		return null
	}

	return (
		<Button
			type="button"
			variant="outline"
			className="border-green-500 text-green-700 hover:bg-green-50 dark:text-green-400"
			onClick={controller.requestOpenForm}
			disabled={controller.isPending}
		>
			<CheckCircle2 className="mr-1.5 h-4 w-4" />
			Mark as Paid
		</Button>
	)
}

export function PaymentHistoryUpdatePaymentForm({
	controller,
}: PaymentHistoryUpdatePaymentFormProps) {
	if (!controller.markPaidMode) {
		return null
	}

	return (
		<div className="rounded-lg border border-green-300 bg-green-50 p-4 space-y-4 dark:border-green-800 dark:bg-green-950/30">
			<p className="flex items-center gap-2 text-sm font-semibold text-green-800 dark:text-green-300">
				<CheckCircle2 className="h-4 w-4" />
				Mark as Paid
				{controller.currentDisplayStatus === 'paid' ? (
					<span className="ml-1 text-xs font-normal text-yellow-700 dark:text-yellow-400">
						overriding existing paid record (admin approved)
					</span>
				) : null}
			</p>

			{controller.markPaidError ? (
				<div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
					{controller.markPaidError}
				</div>
			) : null}

			<div className="space-y-2">
				<Label className="text-xs text-muted-foreground uppercase tracking-wider">Payment Method</Label>
				<Select
					value={controller.markPaidMethodId}
					onValueChange={(value) => {
						controller.setMarkPaidMethodId(value)
						controller.setMarkPaidRefNum('')
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select payment method" />
					</SelectTrigger>
					<SelectContent>
						{controller.paymentMethodOptions.map((method) => (
							<SelectItem key={method.id} value={method.id}>
								{method.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{controller.markPaidMethodId && !controller.isCashMethod(controller.markPaidMethodId) ? (
				<div className="space-y-2">
					<Label className="text-xs text-muted-foreground uppercase tracking-wider">
						Reference Number <span className="text-destructive">*</span>
					</Label>
					<Input
						value={controller.markPaidRefNum}
						onChange={(event) => controller.setMarkPaidRefNum(event.target.value)}
						placeholder="Enter transaction / reference number"
					/>
				</div>
			) : null}

			<div className="space-y-2">
				<Label className="text-xs text-muted-foreground uppercase tracking-wider">Paid Date</Label>
				<Popover>
					<PopoverTrigger asChild>
						<Button type="button" variant="outline" className="w-full justify-start text-left font-normal">
							<CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
							{controller.markPaidAt ? (
								format(controller.markPaidAt, 'MMM d, yyyy')
							) : (
								<span className="text-muted-foreground">Today ({format(new Date(), 'MMM d, yyyy')})</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-2" align="start">
						<Calendar
							mode="single"
							selected={controller.markPaidAt ?? new Date()}
							onSelect={(date) => controller.setMarkPaidAt(date ?? undefined)}
							disabled={{ after: new Date() }}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			</div>

			<div className="flex justify-end gap-2 pt-1">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={controller.closeForm}
					disabled={controller.isPending}
				>
					Cancel
				</Button>
				<Button
					type="button"
					size="sm"
					className="bg-green-600 text-white hover:bg-green-700"
					onClick={() => void controller.submit()}
					disabled={!controller.canSubmit}
				>
					{controller.isPending ? 'Saving...' : 'Confirm Payment'}
				</Button>
			</div>
		</div>
	)
}

export function PaymentHistoryUpdatePaymentAdminConfirm({
	controller,
}: PaymentHistoryUpdatePaymentAdminConfirmProps) {
	return (
		<EditAdminConfirmDialog
			open={controller.showMarkPaidAdminConfirm}
			onOpenChange={controller.setShowMarkPaidAdminConfirm}
			onConfirm={controller.confirmOverride}
			title="Override Paid Record"
			description="This transaction is already marked as paid. Admin confirmation is required to override it. Please enter your admin password to proceed."
			confirmText="Override & Edit"
		/>
	)
}
