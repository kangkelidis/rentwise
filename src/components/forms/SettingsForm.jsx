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

// import { toast } from '@/components/ui/use-toast'


import { settingsValidationSchema } from '@/lib/validations/schemas'

import { useRouter, usePathname } from 'next/navigation'
import { deleteGroup, updateGroup } from '@/lib/actions/group.actions'

export function SettingsForm({ settings }) {
	const router = useRouter()
	const pathname = usePathname()
	if (settings) {
		settings = JSON.parse(settings)
	}
	const form = useForm({
		resolver: zodResolver(settingsValidationSchema),
		defaultValues: {
			name: settings?.name || '',
		},
	})

    async function onErrors(values) {


	}

	async function onSubmit(values) {
		const success = await updateGroup(settings?._id, values, pathname)
		if (success) {
			router.push('/settings')
		}
	}

	async function onDelete() {
		const success = await deleteGroup(settings._id, pathname)
		if (success) {
			router.push('/settings')
		} else {
		}
	}

	return (
		<Form {...form}>
			<form action={form.handleSubmit(onSubmit, onErrors)} className='space-y-8'>
				<FormField
					control={form.control}
					name='group'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Group Name</FormLabel>
							<FormControl>
								<Input placeholder='' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex place-content-between'>
					<Button type='submit'>Submit</Button>

					{settings && (
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
