import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { EmployeeTableDTO } from '@/api/generated/models'
import { employeeFormSchema } from '@/types/user/userSchemas'
import type { EmployeeFormInput, EmployeeFormValues } from '@/types/user/userSchemas'

export interface EmployeeDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	employee: EmployeeTableDTO | null
	onSubmit: (values: EmployeeFormValues) => Promise<void>
}

export function EmployeeDialog({
	open,
	onOpenChange,
	employee,
	onSubmit,
}: EmployeeDialogProps) {
	const form = useForm<EmployeeFormInput>({
		resolver: zodResolver(employeeFormSchema),
		defaultValues: {
			firstName: '',
			surname: '',
			middleName: '',
			contactNo: '',
			status: 'IN',
			suffix: '',
		},
		values: employee
			? {
					firstName: employee.firstName,
					surname: employee.surname,
					middleName: employee.middleName ?? '',
					contactNo: employee.contactNo,
					status: employee.status,
					suffix: employee.suffix ?? '',
				}
			: undefined,
	})

	const handleSubmit = async (values: EmployeeFormInput) => {
		try {
			const parsed = employeeFormSchema.parse(values)
			await onSubmit(parsed)
			form.reset()
		} catch (error) {
			console.error('Error submitting form', error)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-150">
				<DialogHeader>
					<DialogTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
					<DialogDescription>
						{employee
							? 'Update employee details.'
							: 'Create a new employee record.'}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input placeholder="John" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="surname"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Surname</FormLabel>
										<FormControl>
											<Input placeholder="Doe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="middleName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Middle Name (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="M." {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="suffix"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Suffix (Optional)</FormLabel>
										<FormControl>
											<Input placeholder="Jr., Sr., III" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="contactNo"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Contact Number</FormLabel>
										<FormControl>
											<Input placeholder="+1234567890" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select status" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="IN">Active (IN)</SelectItem>
												<SelectItem value="OUT">Inactive (OUT)</SelectItem>
												<SelectItem value="UNDECIDED">Undecided</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? (
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
								) : null}
								{employee ? 'Save Changes' : 'Create Employee'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
