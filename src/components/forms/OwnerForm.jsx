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

// import { toast } from '@/components/ui/use-toast'

import { updateOwner, deleteOwner } from '@/lib/actions/owner.actions'
import { ownerValidationSchema } from '@/lib/validations/schemas'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'

export function OwnerForm({ data }) {
	const router = useRouter()
	const pathname = usePathname()
	data = JSON.parse(data)
	const owner = data.owner

	const form = useForm({
		resolver: zodResolver(ownerValidationSchema),
		defaultValues: {
			name: owner?.name || '',
		},
	})

	async function onSubmit(values) {
		console.log(values);
		const success = await updateOwner(owner?._id, values, pathname)
		if (success) {
			router.push('/owners')
		}
	}

	async function onDelete() {
		const success = await deleteOwner(owner._id, pathname)
		if (success) {
			router.push('/owners')
		} else {
		}
	}

	return (
		<Form {...form}>
			<form action={form.handleSubmit(onSubmit)} className='space-y-8'>
				<div className='form-container'>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input className='form-input' isRequired placeholder='' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className='flex place-content-between'>
					<Button type='submit' color='primary'>
						Submit
					</Button>
					{owner && (
						<Button type='button' color='danger' onClick={onDelete}>
							Delete
						</Button>
					)}
					<Button type='button' color='secondary' onClick={() => router.back()}>
						Back
					</Button>
				</div>
			</form>
		</Form>
	)
}
