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
import { Select, SelectSection, SelectItem } from '@nextui-org/select'

import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@nextui-org/input'

import { updateVehicle, deleteVehicle } from '@/lib/actions/vehicle.actions'
import { vehicleValidationSchema } from '@/lib/validations/schemas'

import { useRouter, usePathname } from 'next/navigation'
import Upload from '@/components/elements/Upload'
import Carousel from '@/components/elements/Carousel'

import {
	TRANSMISSION,
	BODY_TYPES,
	NUM_SEATS,
	NUM_DOORS,
	COLORS,
	EXTRAS,
	FUEL_TYPES,
} from '@/constants'
import { useState } from 'react'

export function VehicleForm({ data }) {
	const router = useRouter()
	const pathname = usePathname()

	data = JSON.parse(data)
	const groups = data.groups
	const owners = data.owners
	const vehicle = data.vehicle
	const insurances = data.insurances

	const [photos, setPhotos] = useState(vehicle?.photos ? vehicle.photos : [])

	const form = useForm({
		resolver: zodResolver(vehicleValidationSchema),
		defaultValues: {
			make: vehicle?.make || '',
			model: vehicle?.model || '',
			year: vehicle?.year || '',
			registration: vehicle?.registration || '',
			group: vehicle?.group || '',
			owner: vehicle?.owner || '',
			transmission: vehicle?.transmission || '',
			body_type: vehicle?.body_type || '',
			fuel_type: vehicle?.fuel_type || '',
			fuel_amount: vehicle?.fuel_amount || '',
			vol_engine: vehicle?.vol_engine || '',
			odometer: vehicle?.odometer || '',
			num_seats:
				vehicle?.num_seats && !isNaN(vehicle.num_seats)
					? String(vehicle.num_seats)
					: '',
			num_doors:
				vehicle?.num_doors && !isNaN(vehicle.num_doors)
					? String(vehicle.num_doors)
					: '',
			color: vehicle?.color || '',
			extras: vehicle?.extras || '',
			basic_day_rate: vehicle?.basic_day_rate || '',
			long_term_rate: vehicle?.long_term_rate || '',
			default_insurance: vehicle?.default_insurance || '',
			notes: vehicle?.notes || '',
		},
	})

	async function onSubmit(values) {
		values.photos = photos
		const success = await updateVehicle(vehicle?._id, values, pathname)
		if (success) {
			if (pathname.includes('/fleet/')) {
				router.back()
			} else {
				router.push('/fleet')
			}
		}
	}

	async function onDelete() {
		const success = await deleteVehicle(vehicle._id, pathname)
		if (success) {
			router.push('/fleet')
		} else {
		}
	}

	function handleBodyTypeChange(event, onChange) {
		if (event.target.value[0] === '') {
			return
		}
		event.target.value = event.target.value.split(',')
		onChange(event)
	}

	return (
		<Form {...form}>
			<form action={form.handleSubmit(onSubmit)} className='space-y-8'>
				<div className='form-container'>
					<FormField
						control={form.control}
						name='make'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										className='form-input'
										label='Make'
										isRequired
										placeholder='Mercedes-Benz'
										{...field}
									/>
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
								<FormControl>
									<Input
										className='form-input'
										label='Model'
										isRequired
										placeholder='E220'
										{...field}
									/>
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
								<FormControl>
									<Input
										className='form-input'
										isRequired
										label='Year'
										type='number'
										min={1990}
										max={2040}
										placeholder={2023}
										{...field}
									/>
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
								<FormControl>
									<Input
										className='form-input'
										isRequired
										label='Registration'
										placeholder='ABC123'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='basic_day_rate'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										className='form-input'
										isRequired
										label='Basic Day Rate'
										placeholder='100'
										type='number'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='long_term_rate'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										className='form-input'
										isRequired
										label='Long Term Day Rate'
										placeholder='35'
										type='number'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='group'
						render={({ field }) => (
							<FormItem>
								<Select
									className='form-input'
									onChange={field.onChange}
									defaultSelectedKeys={field.value ? [field.value] : undefined}
									label='Group'
									isRequired
									size='sm'
								>
									{groups.map((group) => (
										<SelectItem key={group.id} textValue={group.name}>
											{group.name}
										</SelectItem>
									))}
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

<FormField
						control={form.control}
						name='default_insurance'
						render={({ field }) => (
							<FormItem>
								<Select
									className='form-input'
									onChange={field.onChange}
									defaultSelectedKeys={field.value ? [field.value] : undefined}
									label='Default Insurance'
									size='sm'
								>
									{insurances.map((ins) => (
										<SelectItem key={ins.id} textValue={ins.name}>
											{ins.name}
										</SelectItem>
									))}
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='transmission'
						render={({ field }) => (
							<FormItem>
								<Select
									className='form-input'
									onChange={field.onChange}
									defaultSelectedKeys={field.value ? [field.value] : undefined}
									label='Transmission'
									isRequired
									size='sm'
								>
									{TRANSMISSION.map((type) => (
										<SelectItem key={type} textValue={type}>
											{type}
										</SelectItem>
									))}
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='body_type'
						render={({ field }) => (
							<FormItem>
								<Select
									className='form-input'
									onChange={(e) => handleBodyTypeChange(e, field.onChange)}
									defaultSelectedKeys={
										field.value.length && field.value[0] !== ''
											? new Set(field.value)
											: undefined
									}
									selectionMode='multiple'
									label='Body Type'
									size='sm'
								>
									{BODY_TYPES.map((type) => (
										<SelectItem key={type} textValue={type}>
											{type}
										</SelectItem>
									))}
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='fuel_type'
						render={({ field }) => (
							<FormItem>
								<Select
									className='form-input'
									onChange={field.onChange}
									defaultSelectedKeys={field.value ? [field.value] : undefined}
									label='Fuel Type'
									size='sm'
								>
									{FUEL_TYPES.map((type) => (
										<SelectItem key={type} textValue={type}>
											{type}
										</SelectItem>
									))}
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='fuel_amount'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										className='form-input'
										label='Fuel Percentage'
										placeholder='60'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='vol_engine'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										className='form-input'
										label='Engine size'
										placeholder='1600cc'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='odometer'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										className='form-input'
										label='Odometer'
										placeholder=''
										type='number'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='num_seats'
						render={({ field }) => {
							return (
								<FormItem>
									<Select
										className='form-input'
										onChange={field.onChange}
										defaultSelectedKeys={
											field.value ? [field.value] : undefined
										}
										label='Num of Seats'
										size='sm'
										items={NUM_SEATS}
									>
										{NUM_SEATS.map((type) => (
											<SelectItem key={type.id} textValue={type.id}>
												{type.id}
											</SelectItem>
										))}
									</Select>
									<FormMessage />
								</FormItem>
							)
						}}
					/>

					<FormField
						control={form.control}
						name='num_doors'
						render={({ field }) => (
							<FormItem>
								<Select
									className='form-input'
									onChange={field.onChange}
									defaultSelectedKeys={field.value ? [field.value] : undefined}
									label='Num of Doors'
									size='sm'
								>
									{NUM_DOORS.map((type) => (
										<SelectItem key={type.id} textValue={type.id}>
											{type.id}
										</SelectItem>
									))}
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='owner'
						render={({ field }) => (
							<FormItem>
								<Select
									className='form-input'
									onChange={field.onChange}
									defaultSelectedKeys={field.value ? [field.value] : undefined}
									label='Owner'
									size='sm'
									isRequired
								>
									{owners.map((item) => (
										<SelectItem key={item.id} textValue={item.name}>
											{item.name}
										</SelectItem>
									))}
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='color'
						render={({ field }) => {
							return (
								<FormItem>
									<Select
										className='form-input'
										items={COLORS}
										onChange={field.onChange}
										defaultSelectedKeys={
											field.value ? [field.value] : undefined
										}
										label='Color'
										size='sm'
										renderValue={(items) => {
											return items.map((item) => {
												return (
													<div key={item.data.id} className='flex gap-2'>
														<div
															className='w-4 h-4 rounded-full mt-[0.8px]'
															style={{ backgroundColor: item.data.name }}
														></div>
														{item.data.name}
													</div>
												)
											})
										}}
									>
										{(color) => {
											return (
												<SelectItem
													key={color.name}
													textValue={color.name}
													value={color.name}
												>
													<div className='flex gap-2'>
														<div
															className='w-4 h-4 rounded-full mt-[0.8px]'
															style={{ backgroundColor: color.name }}
														></div>
														{color.name}
													</div>
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
						name='extras'
						render={({ field }) => (
							<FormItem>
								<Select
									className='form-input'
									onChange={(e) => handleBodyTypeChange(e, field.onChange)}
									defaultSelectedKeys={
										field.value.length && field.value[0] !== ''
											? new Set(field.value)
											: undefined
									}
									selectionMode='multiple'
									label='Extras'
									size='sm'
								>
									{EXTRAS.map((item) => (
										<SelectItem key={item} textValue={item}>
											{item}
										</SelectItem>
									))}
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='notes'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										className=' form-input sm:!w-[550px]'
										required={false}
										label='Notes'
										placeholder=''
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='carousel-container'>
						<Carousel photos={photos} />
						<Upload setPhotos={setPhotos} />
					</div>
				</div>
				<div className='flex place-content-between'>
					<Button type='submit'>Submit</Button>
					{vehicle && (
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
