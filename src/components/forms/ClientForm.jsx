'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'

import { cn } from '@/lib/utils'
// import { toast } from '@/components/ui/use-toast'
import { format } from 'date-fns'

import { updateClient, deleteClient } from '@/lib/actions/client.actions'
import { clientValidationSchema } from '@/lib/validations/schemas'

import { useRouter, usePathname } from 'next/navigation'

export function ClientForm({ vehicles, client }) {
	const router = useRouter()
	const pathname = usePathname()
	if (client) {
		client = JSON.parse(client)
	}
	const form = useForm({
		resolver: zodResolver(clientValidationSchema),
		defaultValues: {
			first_name: client?.first_name || '',
			last_name: client?.last_name || '',
		},
	})

	async function onSubmit(values) {
		const success = await updateClient(client?._id, values, pathname)
		if (success) {
			router.push('/clients')
		}
	}

	async function onDelete() {
		const success = await deleteClient(client._id, pathname)
		if (success) {
			router.push('/clients')
		} else {
		}
	}

	return (
		<Form {...form}>
			<form action={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='first_name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='last_name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last Name</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex place-content-between'>
					<Button type='submit'>Submit</Button>
					{client && (
						<Button type='button' variant='destructive' onClick={onDelete}>
							Delete
						</Button>
					)}
					<Button
						type='button'
						variant='secondary'
						onClick={() => router.back()}
					>
						Back
					</Button>
				</div>
			</form>
		</Form>
	)
}
