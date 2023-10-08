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
import { Check, ChevronsUpDown, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

import { updateOrder, deleteOrder } from '@/lib/actions/order.actions'
import { orderValidationSchema } from '@/lib/validations/order'

import { useRouter, usePathname } from 'next/navigation'

export function OrderForm({ vehicles, order }) {
	const router = useRouter()
	const pathname = usePathname()
	if (order) {
		order = JSON.parse(order)
	}
	vehicles = JSON.parse(vehicles)
	const form = useForm({
		resolver: zodResolver(orderValidationSchema),
		defaultValues: {
			vehicle_id: order?.vehicle_id || '',
			pick_up_date: order?.pick_up_date || '',
			drop_off_date: order?.drop_off_date || '',
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
			router.push('/orders')
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
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant='outline'
											role='combobox'
											className={cn(
												'w-[200px] justify-between',
												!field.value && 'text-muted-foreground'
											)}
										>
											{field.value
												? vehicles.find(
														(vehicle) => vehicle.value === field.value
												  )?.label
												: 'Select car'}
											<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className='w-[200px] p-0'>
									<Command>
										<CommandInput placeholder='Search car...' />
										<CommandEmpty>No car found.</CommandEmpty>
										<CommandGroup>
											{vehicles.map((vehicle) => (
												<CommandItem
													value={vehicle.label}
													key={vehicle.value}
													onSelect={() => {
														form.setValue('vehicle_id', vehicle.value)
													}}
												>
													<Check
														className={cn(
															'mr-2 h-4 w-4',
															vehicle.value === field.value
																? 'opacity-100'
																: 'opacity-0'
														)}
													/>
													{vehicle.label}
												</CommandItem>
											))}
										</CommandGroup>
									</Command>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='pick_up_date'
					render={({ field }) => (
						<FormItem className='flex flex-col'>
							<FormLabel>Pick-up Date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={'outline'}
											className={cn(
												'w-[240px] pl-3 text-left font-normal',
												!field.value && 'text-muted-foreground'
											)}
										>
											{field.value ? (
												format(field.value, 'PPP')
											) : (
												<span>Pick a date</span>
											)}
											<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-0' align='start'>
									<Calendar
										mode='single'
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) =>
											date < new Date() || date < new Date('1900-01-01')
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>
				
				<FormField
					control={form.control}
					name='drop_off_date'
					render={({ field }) => (
						<FormItem className='flex flex-col'>
							<FormLabel>Drop-off Date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={'outline'}
											className={cn(
												'w-[240px] pl-3 text-left font-normal',
												!field.value && 'text-muted-foreground'
											)}
										>
											{field.value ? (
												format(field.value, 'PPP')
											) : (
												<span>Pick a date</span>
											)}
											<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-0' align='start'>
									<Calendar
										mode='single'
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) =>
											date < new Date() || date < new Date('1900-01-01')
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex place-content-between'>
					<Button type='submit'>Submit</Button>
					{order && (
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
