'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Form,
	FormControl,
    FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'

import { CreateNewCar } from '@/lib/actions'

const formSchema = z.object({
	make: z.string(),
	model: z.string(),
	year: z.coerce.number(),
	registration: z.string(),
})

export function NewCarForm() {
	// 1. Define your form.
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			make: '',
			model: '',
			year: null,
			registration: '',
		},
	})

	// 2. Define a submit handler.
	async function onSubmit(values) {
        const success = await CreateNewCar(values)
        console.log(success);
	}

	return (
		<Form {...form}>
			<form action={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='make'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Make</FormLabel>
							<FormControl>
								<Input placeholder='Mercedes-Benz' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='model'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Model</FormLabel>
							<FormControl>
								<Input placeholder='E220' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='year'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Year</FormLabel>
							<FormControl>
								<Input type='number' min={1990} max={2040} placeholder={2023} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='registration'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Registration</FormLabel>
							<FormControl>
								<Input placeholder='ABC123' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit'>Submit</Button>
			</form>
		</Form>
	)
}
