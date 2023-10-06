'use client'

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

import { createNewCar } from '@/lib/actions/cars.actions'
import { carValidationSchema } from '@/lib/validations/car'

import { useRouter } from 'next/navigation'

export function NewCarForm() {
	const router = useRouter()

	const form = useForm({
		resolver: zodResolver(carValidationSchema),
		defaultValues: {
			make: '',
			model: '',
			year: '',
			registration: '',
		},
	})

	async function onSubmit(values) {
        const success = await createNewCar(values)
		if (success) {
			router.push('/fleet')
		}
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
				<div className='flex place-content-between'>
					<Button type='submit'>Submit</Button>
					<Button 
						variant='secondary'
						type='link'
						onClick={() => (router.back())}
						>Back</Button>
				</div>
			</form>
		</Form>
	)
}
