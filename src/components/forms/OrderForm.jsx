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
import UsePopover from '../hooks/usePopover'
import Signature from '../elements/Signature'
import Image from 'next/image'

function ExtraDriver({ index, form, extraDrivers, setExtraDrivers, setExtraDriversNum }) {
	const ed = form.getValues().extra_drivers
	const defaultValues = {
		full_name: ed.length > index && ed[index].full_name ? ed[index].full_name : '',
		license: ed.length > index && ed[index].license ? ed[index].license : ''
	}

	function onSave(e, field) {
		const exd = [...extraDrivers,
		]
		exd[index] = {
			...extraDrivers[index],
			[field]: e.target.value
		}
		setExtraDrivers(exd)
		form.setValue('extra_drivers', exd)
	}

	function onDelete() {
		const exd = [...extraDrivers]
		exd.splice(index, 1)
		setExtraDrivers(exd)
		form.setValue('extra_drivers', exd)
		setExtraDriversNum(prev => prev-1)

	}

	return (
		<div>
			<h4>Extra Driver no: {index+1}</h4>
			<div className='flex flex-row gap-3'>
				<FormField
					control={form.control}
					name={`extra_drivers_full_name${index}`}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									defaultValue={defaultValues.full_name}
									className='form-input'
									label='Full Name'
									placeholder=''
									{...field}
									onBlur={(e) => onSave(e, 'full_name')}

								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={`extra_drivers_license${index}`}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									defaultValue={defaultValues.license}
									className='form-input'
									label='License Number'
									placeholder=''
									{...field}
									onBlur={(e) => onSave(e, 'license')}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
				isIconOnly
				className='bg-transparent'
				type='button'
				onClick={onDelete}>
							<img src='/assets/delete.svg'></img>

				</Button>
			</div>
		</div>
	)
}

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
	const [extraDriversNum, setExtraDriversNum] = useState(
		order?.extra_drivers?.length || 0
	)
	const [extraDrivers, setExtraDrivers] = useState(order?.extra_drivers || [])

	const form = useForm({
		resolver: zodResolver(orderValidationSchema),
		defaultValues: {
			vehicle: order?.vehicle.id || '',
			client: order?.client.id || '',
			pick_up_date: order ? new Date(order.pick_up_date) : '',
			drop_off_date: order ? new Date(order.drop_off_date) : '',
			pick_up_location: order?.pick_up_location || '',
			drop_off_location: order?.drop_off_location || '',
			extras: order?.extras.map((e) => e.id) || [],
			insurance: order?.insurance.id || '',
			client_signature: order?.client_signature || '',
			extra_drivers: order?.extra_drivers || [],
		},
	})

	const watchAll = form.watch()

	async function onSubmit(values) {
		console.log('submit', values)
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

							<Button
								type='button'
								onClick={() => setExtraDriversNum((prev) => prev + 1)}
							>
								Add Extra Driver
							</Button>
							<FormField
							control={form.control}
								name='extra_drivers'
								render={({ field }) => (

									Array(extraDriversNum)
										.fill()
										.map((_, i) => {
											return <ExtraDriver index={i} form={form} extraDrivers={extraDrivers} setExtraDrivers={setExtraDrivers} setExtraDriversNum={setExtraDriversNum}/>
										})
									
								)}
									>
							</FormField>


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
							<FormField
								control={form.control}
								name='client_signature'
								render={({ field }) => {
									const src =
										field.value !== '' ? field.value : order.client_signature
									return (
										<FormItem>
											<FormLabel>Signature</FormLabel>
											<FormControl>
												<Signature
													field={field}
													form={form}
													clientSignature={true}
												/>
											</FormControl>
											<FormMessage />

											<Image
												width={100}
												height={100}
												alt='signature'
												src={src}
											/>
										</FormItem>
									)
								}}
							/>
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
