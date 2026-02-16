import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2, UserPlus, XCircle } from 'lucide-react'

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
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { EmployeeTableDTO } from '@/api/generated/models'
import { employeeFormSchema } from '@/types/user/userSchemas'
import type { EmployeeFormInput, EmployeeFormValues, CreateUserFormInput } from '@/types/user/userSchemas'
import { useUserActions } from '@/hooks/users/useUserActions'
import { useAuthSession } from '@/lib/auth/auth-session'
import { isAdminSession } from '@/lib/auth/auth-permissions'
import { CreateEmployeeLoginDialog } from './CreateEmployeeLoginDialog'

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
	const [showCreateLoginModal, setShowCreateLoginModal] = useState(false)
	const [userCreated, setUserCreated] = useState(false)
	const { createUser } = useUserActions()
	const session = useAuthSession()
	const canCreateEmployeeLogin = useMemo(
		() => isAdminSession({ token: session.token, roles: session.roles }),
		[session.token, session.roles],
	)

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

	// Reset forms and state when dialog closes
	useEffect(() => {
		if (!open) {
			setShowCreateLoginModal(false)
			setUserCreated(false)
		}
	}, [open])

	const hasUser = employee?.user

	const handleSubmit = async (values: EmployeeFormInput) => {
		try {
			const parsed = employeeFormSchema.parse(values)
			await onSubmit(parsed)
			form.reset()
		} catch (error) {
			console.error('Error submitting form', error)
		}
	}

	const handleCreateUser = async (values: CreateUserFormInput) => {
		if (!employee) throw new Error('Employee is required to create login access.')
		try {
			const result = await createUser.mutateAsync(values)
			const createdUserId = result.data?.id
			if (!createdUserId) {
				throw new Error(result.message ?? 'User created but no user ID returned.')
			}

			await onSubmit({
				firstName: employee.firstName,
				surname: employee.surname,
				middleName: employee.middleName ?? '',
				contactNo: employee.contactNo,
				status: employee.status,
				suffix: employee.suffix ?? '',
				userId: createdUserId,
			})

			setUserCreated(true)
			setShowCreateLoginModal(false)
			
			console.log('User created:', result)
		} catch (error) {
			console.error('Error creating user', error)
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{employee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
					<DialogDescription>
						{employee
							? 'Update employee details and manage login access.'
							: 'Create a new employee record. You can add login access after creating the employee.'}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Employee Form */}
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

					{/* User Login Section - Only show for existing employees */}
					{employee && (
						<>
							<Separator />
							
							<Card>
								<CardHeader>
									<CardTitle className="text-base flex items-center gap-2">
										{hasUser ? (
											<>
												<CheckCircle2 className="h-4 w-4 text-green-600" />
												Login Access Enabled
											</>
										) : (
											<>
												<XCircle className="h-4 w-4 text-muted-foreground" />
												No Login Access
											</>
										)}
									</CardTitle>
										<CardDescription>
										{hasUser
											? 'This employee has system login access.'
											: 'Create login credentials for roles that need system access (Admin, Manager, Cashier).'}
									</CardDescription>
								</CardHeader>
									<CardContent className="space-y-2">
										{hasUser || userCreated ? (
											<p className="text-sm text-muted-foreground">Login account is already linked to this employee.</p>
										) : canCreateEmployeeLogin ? (
											<Button type="button" variant="outline" onClick={() => setShowCreateLoginModal(true)}>
												<UserPlus className="mr-2 h-4 w-4" />
												Create Login Access
											</Button>
										) : (
											<p className="text-sm text-muted-foreground">Only admins can create employee login access.</p>
										)}
									</CardContent>
							</Card>

								<CreateEmployeeLoginDialog
									open={showCreateLoginModal}
									onOpenChange={setShowCreateLoginModal}
									employeeName={`${employee.firstName} ${employee.surname}`}
									onSubmit={handleCreateUser}
									isSubmitting={createUser.isPending}
								/>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
