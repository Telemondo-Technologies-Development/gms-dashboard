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
import { createUserFormSchema } from '@/types/user/userSchemas'
import type { CreateUserFormInput, CreateUserFormValues } from '@/types/user/userSchemas'

export interface AddUserDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (values: CreateUserFormValues) => Promise<void>
}

export function AddUserDialog({
	open,
	onOpenChange,
	onSubmit,
}: AddUserDialogProps) {
	const form = useForm<CreateUserFormInput>({
		resolver: zodResolver(createUserFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const handleSubmit = async (values: CreateUserFormInput) => {
		try {
			const parsed = createUserFormSchema.parse(values)
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
					<DialogTitle>Create System User</DialogTitle>
					<DialogDescription>
						Create a new user account that can log in.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input type="email" placeholder="john.doe@example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="••••••" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? (
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
								) : null}
								Create User
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
