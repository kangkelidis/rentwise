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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { updateOrder, deleteOrder } from '@/lib/actions/order.actions'
import { orderValidationSchema } from '@/lib/validations/order'

import { useRouter, usePathname } from 'next/navigation'

export function OrderForm({order}) {
	const router = useRouter()
	const pathname = usePathname()
	if (order) {
		order = JSON.parse(order)
	}

	const form = useForm({
		resolver: zodResolver(orderValidationSchema),
		defaultValues: {
			vehicle_id:  order?.vehicle_id || '',
			pick_up_date: order?.pick_up_date || '',
			drop_off_date:  order?.drop_off_date || '',
		},
	})

	async function onSubmit(values) {
        const success = await updateOrder(order?._id, values, pathname)
		if (success) {
            router.push('/orders')
		}
	}

	async function onDelete() {
		const success = await deleteOrder(order._id, pathname) 
		if (success) {
			router.push("/orders")
		} else {
			
		}
	}

	return (
		<Form {...form}>
			<form action={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='vehicle_id'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Vehicle</FormLabel>
							<FormControl>
								<Input placeholder='Mercedes-Benz' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='pick_up_date'
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
					name='drop_off_date'
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
				<div className='flex place-content-between'>
					<Button type='submit'>Submit</Button>
					{order && 
						<Button type='button' variant='destructive' 
							onClick={onDelete}
						>Delete</Button>
					}
					<Button type='button' variant='secondary'
						onClick={() => (router.back())}
					>Back</Button>
				</div>
			</form>
		</Form>
	)
}
