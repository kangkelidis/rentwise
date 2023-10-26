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
import { Input, Textarea } from '@nextui-org/input'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectItem } from '@nextui-org/select'
import { Checkbox, CheckboxGroup } from '@nextui-org/checkbox'
import { RadioGroup, Radio } from '@nextui-org/radio'

import { cn } from '@/lib/utils'
// import { toast } from '@/components/ui/use-toast'
import { Check, ChevronsUpDown, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import VehicleDetails from '../elements/vehicle-details'

import {
	createOrder,
	deleteOrder,
	updateOrder,
} from '@/lib/actions/order.actions'
import { orderValidationSchema } from '@/lib/validations/schemas'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import Total from '../shared/Total'
import { tr } from 'date-fns/locale'
import UsePopover from '../hooks/usePopover'

export function OrderForm({ data }) {
	const router = useRouter()
	const pathname = usePathname()
	data = JSON.parse(data)
	const vehicles = data.vehicles
	const clients = data.clients
	const order = data.order
	const equipment = data.equipment
	const insurances = data.insurances

	const [isDifferentReturnSelected, setDifferentReturnSelected] =
		useState(false)
	const [pricePerDay, setPricePerDay] = useState(0)

	const form = useForm({
		resolver: zodResolver(orderValidationSchema),
		defaultValues: {
			vehicle: order?.vehicle || '',
			client: order?.client || '',
			pick_up_date: order ? new Date(order.pick_up_date) : '',
			drop_off_date: order ? new Date(order.drop_off_date) : '',
			pick_up_location: order?.pick_up_location || '',
			drop_off_location: order?.drop_off_location || '',
			extras: order?.extras || [],
			insurance: order?.insurance || '',
		},
	})

	const watchAll = form.watch()

	async function onSubmit(values) {
		const newValues = {
			...values,
			price_per_day: pricePerDay,
			drop_off_location: isDifferentReturnSelected
				? values.drop_off_location
				: values.pick_up_location,
		}
		let success
		if (order) {
			success = await updateOrder(order._id, newValues, pathname)
		} else {
			success = await createOrder(newValues, pathname)
		}
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
		<div className='md:flex md:flex-row-reverse md:gap-5 '>
			<UsePopover>
				<Total
					setPricePerDay={setPricePerDay}
					watch={watchAll}
					vehicles={vehicles}
					equipment={equipment}
					insurances={insurances}
				/>
			</UsePopover>
			<div className='max-md:hidden w-4/5'>
				<Total
					setPricePerDay={setPricePerDay}
					watch={watchAll}
					vehicles={vehicles}
					equipment={equipment}
					insurances={insurances}
				/>
			</div>

<div className=''>
			<Form {...form}>
				<form action={form.handleSubmit(onSubmit)} className='space-y-8'>
					<div className='form-container'>
						<FormField
							control={form.control}
							name='vehicle'
							render={({ field }) => {
								return (
									<FormItem>
										<Select
											className='form-input'
											items={vehicles}
											onChange={field.onChange}
											defaultSelectedKeys={
												field.value ? [field.value] : undefined
											}
											label='Vehicle'
											labelPlacement='inside'
											size='lg'
											renderValue={(items) => {
												return items.map((item) => {
													return (
														<div key={item.data.id} className='p-4 mt-2'>
															<VehicleDetails size={2} vehicle={item.data} />
														</div>
													)
												})
											}}
										>
											{(vehicle) => {
												return (
													<SelectItem
														key={vehicle.id}
														textValue={vehicle.make}
														value={vehicle.id}
													>
														<VehicleDetails vehicle={vehicle} />
													</SelectItem>
												)
											}}
										</Select>
										<FormMessage />
									</FormItem>
								)
							}}
						/>

						<FormField
							control={form.control}
							name='client'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Client</FormLabel>
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
														? clients.find(
																(client) => client.value === field.value
														  )?.label
														: 'Select client'}
													<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className='w-[200px] p-0'>
											<Command>
												<CommandInput placeholder='Search client...' />
												<CommandEmpty>No client found.</CommandEmpty>
												<CommandGroup>
													{clients.map((client) => (
														<CommandItem
															value={client.label}
															key={client.value}
															onSelect={() => {
																form.setValue('client', client.value)
															}}
														>
															<Check
																className={cn(
																	'mr-2 h-4 w-4',
																	client.value === field.value
																		? 'opacity-100'
																		: 'opacity-0'
																)}
															/>
															{client.label}
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
							name='extras'
							render={({ field }) => (
								<FormItem>
									<CheckboxGroup
										value={field.value}
										onValueChange={field.onChange}
										label='Equipment'
									>
										{equipment?.map((equip) => (
											<Checkbox key={equip.id} value={equip.id}>
												{equip.name}
											</Checkbox>
										))}
									</CheckboxGroup>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='insurance'
							render={({ field }) => (
								<FormItem>
									<RadioGroup
										value={field.value}
										onValueChange={field.onChange}
										label='Insurance'
									>
										{insurances?.map((ins) => (
											<Radio
												key={ins.id}
												value={ins.id}
												description={ins.deposit_amount}
											>
												{ins.name}
											</Radio>
										))}
									</RadioGroup>

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
												disabled={(date) => date < new Date('1900-01-01')}
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
												disabled={(date) => date < new Date('1900-01-01')}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div>
							<FormField
								control={form.control}
								name='pick_up_location'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												className='form-input'
												isRequired
												label='Pick Up Location'
												placeholder='Office'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Checkbox
								isSelected={isDifferentReturnSelected}
								onValueChange={setDifferentReturnSelected}
							>
								Return to different location
							</Checkbox>
						</div>

						{isDifferentReturnSelected && (
							<FormField
								control={form.control}
								name='drop_off_location'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												className='form-input'
												isRequired
												label='Drop Off Location'
												placeholder='LCA'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
					</div>

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

</div>
		</div>
	)
}
