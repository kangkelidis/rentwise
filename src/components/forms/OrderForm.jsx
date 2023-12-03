'use client'
// TODO: make client required
import { zodResolver } from '@hookform/resolvers/zod'
import { get, useForm } from 'react-hook-form'

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
import { Button } from '@nextui-org/button'
import { Button as ButtonUI } from '../ui/button'
import { Input, Textarea } from '@nextui-org/input'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectItem, SelectSection } from '@nextui-org/select'
import { Checkbox, CheckboxGroup } from '@nextui-org/checkbox'
import { RadioGroup, Radio } from '@nextui-org/radio'

import { cn, dateDiffInDays, zeroPad } from '@/lib/utils'
// import { toast } from '@/components/ui/use-toast'
import { Check, ChevronsUpDown, CalendarIcon, Divide } from 'lucide-react'
import { format } from 'date-fns'
import VehicleDetails from '../elements/vehicle-details'

import {
	createOrder,
	deleteOrder,
	updateOrder,
} from '@/lib/actions/order.actions'
import { orderValidationSchema } from '@/lib/validations/schemas'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import Total from '../shared/Total'
import UsePopover from '../hooks/usePopover'
import Signature from '../elements/Signature'
import Image from 'next/image'
import Counter from '../elements/Counter'
import { result } from 'underscore'
import { getNormalPrices } from '@/lib/price/rates'
import Agreement from '../shared/Agreement'
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { StatusRadio } from '../elements/StatusRadio'
import { STATUS } from '@/constants'
import LoadingButton from '../ui/loadingButton'

// TODO: no need to have extradriversnum eand extradivcers use one and use its lenght
function ExtraDriver({
	index,
	form,
	extraDrivers,
	setExtraDrivers,
	setExtraDriversNum,
}) {
	const ed = form.getValues().extra_drivers
	const defaultValues = {
		full_name:
			ed.length > index && ed[index].full_name ? ed[index].full_name : '',
		license: ed.length > index && ed[index].license ? ed[index].license : '',
	}

	function onSave(e, field) {
		const exd = [...extraDrivers]
		exd[index] = {
			...extraDrivers[index],
			[field]: e.target.value,
		}
		setExtraDrivers(exd)
		form.setValue('extra_drivers', exd)
	}

	function onDelete() {
		const exd = [...extraDrivers]
		exd.splice(index, 1)
		setExtraDrivers(exd)
		form.setValue('extra_drivers', exd)
		setExtraDriversNum((prev) => prev - 1)
	}

	return (
		<div>
			<h4>Extra Driver no: {index + 1}</h4>
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
					onClick={onDelete}
				>
					<img alt='delete' src='/assets/delete.svg'/>
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
	const equipment = data.equipment.map((e) => ({ item: e, count: 0 }))
	const insurances = data.insurances
	const settings = data.settings

	const [prices, setPrices] = useState(order?.prices || {})
	const [isLoading, setIsLoading] = useState(false)

	const [isDifferentReturnSelected, setDifferentReturnSelected] =
		useState(false)
	const [extraDriversNum, setExtraDriversNum] = useState(
		order?.extra_drivers?.length || 0
	)
	const [extraDrivers, setExtraDrivers] = useState(order?.extra_drivers || [])
	const [equipmentData, setEquipmentData] = useState(order?.extras.length ? order.extras : equipment)

	const defaultFormValues = {
		vehicle: order?.vehicle.id || '',
		client: order?.client.id || '',
		pick_up_date: order ? new Date(order.pick_up_date) : '',
		drop_off_date: order ? new Date(order.drop_off_date) : '',
		pick_up_location: order?.pick_up_location || '',
		drop_off_location: order?.drop_off_location || '',
		extras: order?.extras || [],
		insurance:
			order?.insurance?.id || order?.vehicle.default_insurance || insurances[0],
		client_signature: order?.client_signature || '',
		status: order?.status || STATUS[0],
		extra_drivers: order?.extra_drivers || [],
	}

	const [dates, setDates] = useState({
		pickUpTime: defaultFormValues.pick_up_date
			? zeroPad(new Date(defaultFormValues.pick_up_date).getHours(), 2) +
			  ':' +
			  zeroPad(new Date(defaultFormValues.pick_up_date).getMinutes(), 2)
			: '',
		pickUpDate: new Date(defaultFormValues.pick_up_date),
		dropOffTime: defaultFormValues.drop_off_date
			? zeroPad(new Date(defaultFormValues.drop_off_date).getHours(), 2) +
			  ':' +
			  zeroPad(new Date(defaultFormValues.drop_off_date).getMinutes(), 2)
			: '',
		dropOffDate: new Date(defaultFormValues.drop_off_date),
	})
	const form = useForm({
		resolver: zodResolver(orderValidationSchema),
		defaultValues: defaultFormValues,
	})

	useEffect(() => {
		form.setValue(
			'extras',
			equipmentData.map((e) => ({
				item: e.item.id,
				count: e.count,
			}))
		)
	}, [equipmentData])

	// const watchAll = form.watch(['client', 'client_signature', 'drop_off_date', 'drop_off_location', 'extra_drivers', 'extras', 'insurance', 'pick_up_date', 'pick_up_location', 'status', 'vehicle'])
	const watchAll = form.watch()
	const watchVehicle = form.watch('vehicle')

	// TODO: perhaps use ref and change insurance on select changed
	useEffect(() => {
		const vehicleId = form.getValues().vehicle
		const vehicle = order?.vehicle || vehicles.find((v) => v.id === vehicleId)
		form.setValue('insurance', vehicle?.default_insurance)
	}, [watchVehicle])

	function onTimeChange(e, fieldName) {
		const time = e.target.value
		setDates((prev) => {
			const newDate = prev[fieldName + 'Date']
			if (newDate) {
				const timeParts = time.split(':')
				const hours = parseInt(timeParts[0], 10)
				const minutes = parseInt(timeParts[1], 10)
				newDate.setHours(hours)
				newDate.setMinutes(minutes)
			}
			form.setValue(
				fieldName === 'pickUp' ? 'pick_up_date' : 'drop_off_date',
				newDate
			)
			return {
				...prev,
				[fieldName + 'Time']: time,
				[fieldName + 'Date']: newDate,
			}
		})
	}

	function onDateChange(e, field, fieldName) {
		const newDate = new Date(e)
		setDates((prev) => {
			if (prev[fieldName + 'Time']) {
				const timeParts = prev[fieldName + 'Time'].split(':')
				const hours = parseInt(timeParts[0], 10)
				const minutes = parseInt(timeParts[1], 10)
				newDate.setHours(hours)
				newDate.setMinutes(minutes)
			}
			return {
				...prev,
				[fieldName + 'Date']: newDate,
			}
		})
		router.push(pathname + '?' + createQueryString(fieldName, newDate))
		field.onChange(newDate)
	}

	async function onSubmit(values) {
		setIsLoading(true)
		updateNormalPrices(form.getValues())
		const newValues = {
			...values,
			drop_off_location: isDifferentReturnSelected
				? values.drop_off_location
				: values.pick_up_location,
			prices: prices,
			status: values.status === STATUS[0] ? STATUS[1] : values.status,
		}
		// TODO: use error form server action
		let success
		if (order) {
			success = await updateOrder(order._id, newValues, pathname)
		} else {
			success = await createOrder(newValues, pathname)
		}
		if (success) {
			router.push('/orders/' + success)
		}
		setIsLoading(false)
	}

	async function onDelete() {
		const success = await deleteOrder(order._id, pathname)
		if (success) {
			router.push('/orders')
		} else {
		}
	}

	function updateNormalPrices(values) {
		// prevent changes if existing
		// TODO: add edit different from view, edit only after change in form
		// if (order) return
		// [{item: 'id', count: 1}] values.extras
		// [{count: 1, item: {name: 'baby seat'}}, ...] equipment
		// [{count: 1, item: {name: 'baby seat'}}, ...]
		let matchingEquipment
		const equipmentParam = values.extras.map((extra) => {
			matchingEquipment = equipment.find(
				(eq) => eq.item.id === extra.item
				)
				return {
					item: matchingEquipment?.item,
					count: extra.count,
				}
			})
			
			const params = {
				num_days: dateDiffInDays(values.pick_up_date, values.drop_off_date),
				vehicle: vehicles.find((v) => v.id === values.vehicle),
				drivers: values.extra_drivers,
				equipment: equipmentParam,
				insurance: insurances.find((i) => i.id === values.insurance),
			}
			if (matchingEquipment) {

				setPrices((prev) => getNormalPrices(params, settings, prev))
			}

	}

	// // update normal prices as form changes
	useEffect(() => {
		updateNormalPrices(form.getValues())
		const subscription = form.watch((values, { name, type }) => {
			updateNormalPrices(values)
		})

		return () => subscription.unsubscribe()
	}, [form.watch ])

	const totalProps = {
		prices: prices,
		setPrices: setPrices,
		watch: watchAll,
		vehicles: vehicles,
		equipment: equipmentData,
		insurances: insurances,
	}

	const searchParams = useSearchParams()
	const createQueryString = useCallback(
		(name, value) => {
			const params = new URLSearchParams(searchParams)
			params.set(name, value)

			return params.toString()
		},
		[searchParams]
	)

	return (
		<div className='md:flex md:flex-row-reverse md:gap-5 '>
			<UsePopover>
				<Total {...totalProps} />
			</UsePopover>
			<div className='max-md:hidden w-5/6'>
				<Total {...totalProps} />
			</div>

			<Card>
				<CardHeader>Order No: {zeroPad(order?.number, 3)}</CardHeader>
				<CardBody>
					<Form {...form}>
						<form action={form.handleSubmit(onSubmit)} className='space-y-8'>
							<div className='form-container'>
								<Card className='w-full'>
									<CardHeader>Status</CardHeader>
									<CardBody className=''>
										<FormField
											control={form.control}
											name='status'
											render={({ field }) => (
												<FormItem className='flex justify-between'>
													{STATUS.map((status) => (
														<StatusRadio form={form} field={field}>
															{status}
														</StatusRadio>
													))}

													<FormMessage />
												</FormItem>
											)}
										/>
									</CardBody>
								</Card>

								<Card className='w-full'>
									<CardHeader>Dates</CardHeader>
									<CardBody className='flex flex-row justify-stretch gap-5'>
										<div>
											<div className='flex items-center'>
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
																<PopoverContent
																	className='w-auto p-0'
																	align='start'
																>
																	<Calendar
																		mode='single'
																		selected={field.value}
																		onSelect={(e) =>
																			onDateChange(e, field, 'pickUp')
																		}
																		disabled={(date) =>
																			date < new Date('1900-01-01')
																		}
																		initialFocus
																	/>
																</PopoverContent>
															</Popover>
															<FormMessage />
														</FormItem>
													)}
												/>

												<input
													value={dates.pickUpTime}
													onChange={(e) => onTimeChange(e, 'pickUp')}
													className='form-input !w-[100px] mt-5 h-fit'
													type='time'
												></input>
											</div>
											<div className='flex items-center'>
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
																<PopoverContent
																	className='w-auto p-0'
																	align='start'
																>
																	<Calendar
																		mode='single'
																		selected={field.value}
																		onSelect={(e) =>
																			onDateChange(e, field, 'dropOff')
																		}
																		disabled={(date) =>
																			date < new Date('1900-01-01')
																		}
																		initialFocus
																	/>
																</PopoverContent>
															</Popover>
															<FormMessage />
														</FormItem>
													)}
												/>
												<input
													value={dates.dropOffTime}
													onChange={(e) => onTimeChange(e, 'dropOff')}
													className='form-input !w-[100px] mt-5 h-fit'
													type='time'
												></input>
											</div>
										</div>

										<Divider orientation='vertical' />
										<div className=''>
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
									</CardBody>
								</Card>

								<Card className='w-full'>
									<CardHeader>Vehicle and Client</CardHeader>
									<CardBody className='flex flex-row gap-5 justify-evenly w-full'>
										<FormField
											control={form.control}
											name='vehicle'
											render={({ field }) => {
												return (
													<FormItem>
														<Select
															className='form-input !w-[20rem]'
															items={vehicles}
															onChange={e => {
																router.replace(pathname + '?' + createQueryString('vehicle', e.target.value))
																field.onChange(e);
															}}
															defaultSelectedKeys={
																field.value ? [field.value] : undefined
															}
															label='Vehicle'
															labelPlacement='inside'
															size='lg'
															fullWidth
															renderValue={(items) => {
																return items.map((item) => {
																	return (
																		<div
																			key={item.data._id}
																			className=' mt-2 h-full'
																		>
																			<VehicleDetails
																				size={2}
																				vehicle={item.data}
																			/>
																		</div>
																	)
																})
															}}
														>
																{(vehicle) => {
																	return (
																		<SelectItem
																			key={vehicle._id}
																			textValue={vehicle.make}
																			value={vehicle.id}
																			className='w-full'
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
										<Divider orientation='vertical' />
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
									</CardBody>
								</Card>

								<Card className='w-full'>
									<CardHeader>Extras</CardHeader>
									<CardBody className='flex  gap-5 w-full'>
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
														<div className='flex flex-row flex-wrap gap-4'>
															{equipmentData.map((equip, index) => (
																<div key={equip.item.id}>
																	<Counter
																		equip={equip}
																		index={index}
																		setEquipmentData={setEquipmentData}
																	/>
																</div>
															))}
														</div>
													</CheckboxGroup>

													<FormMessage />
												</FormItem>
											)}
										/>

										<Divider />

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
														<div className='flex flex-row flex-wrap gap-4'>
															{insurances?.map((ins) => (
																<Radio
																	key={ins.id}
																	value={ins.id}
																	description={ins.deposit_amount}
																>
																	{ins.name}
																</Radio>
															))}
														</div>
													</RadioGroup>

													<FormMessage />
												</FormItem>
											)}
										/>
										<Divider />

										<Button
											type='button'
											onClick={() => setExtraDriversNum((prev) => prev + 1)}
										>
											Add Extra Driver
										</Button>
										<FormField
											control={form.control}
											name='extra_drivers'
											render={({ field }) =>
												Array(extraDriversNum)
													.fill()
													.map((_, i) => {
														return (
															<ExtraDriver
																index={i}
																form={form}
																extraDrivers={extraDrivers}
																setExtraDrivers={setExtraDrivers}
																setExtraDriversNum={setExtraDriversNum}
															/>
														)
													})
											}
										></FormField>
									</CardBody>
								</Card>

								<Card className='w-full'>
									<CardBody>
										<FormField
											control={form.control}
											name='client_signature'
											render={({ field }) => {
												const src =
													field.value !== ''
														? field.value
														: order?.client_signature || ''
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
									</CardBody>
								</Card>
							</div>

							<div className='flex place-content-between'>
								<LoadingButton isLoading={isLoading} type='submit'>Save</LoadingButton>
								{order && (
									<ButtonUI
										type='button'
										variant='destructive'
										onClick={onDelete}
									>
										Delete
									</ButtonUI>
								)}
								{/* <ButtonUI
									type='button'
									variant='secondary'
									onClick={() => router.back()}
								>
									Back
								</ButtonUI> */}
									{order && 
									
								<Agreement prices={prices} settings={settings} order={order}  />
									}
							</div>
						</form>
					</Form>
				</CardBody>
			</Card>
		</div>
	)
}
