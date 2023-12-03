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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@nextui-org/input'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectSection, SelectItem } from '@nextui-org/select'

import countries from '@/lib/data/countries.json' assert { type: 'json' }

import { cn } from '@/lib/utils'
// import { toast } from '@/components/ui/use-toast'

import { updateClient, deleteClient } from '@/lib/actions/client.actions'
import { clientValidationSchema } from '@/lib/validations/schemas'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Check, ChevronsUpDown, CalendarIcon } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import Upload from '../elements/Upload'
import { CldImage } from 'next-cloudinary'
import { Card, CardBody } from '@nextui-org/card'
import { useDisclosure } from '@nextui-org/react'
import Confirmation from '../shared/Confirmation'

export function ClientForm({ data }) {
	const router = useRouter()
	const pathname = usePathname()
	data = JSON.parse(data)
	const client = data.client
	const form = useForm({
		resolver: zodResolver(clientValidationSchema),
		defaultValues: {
			full_name: client?.full_name || '',
			dob: client?.dob ? new Date(client.dob) : '',
			tel: client?.tel || '',
			email: client?.email || '',
			passport: client?.passport || '',
			license: client?.license || '',
			nationality: client?.nationality || '',
			address: client?.address || '',
			documents: client?.documents || [],
		},
	})
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const [deleteItem, setDeleteItem] = useState({
		id: null,
		title: '',
		action: () => {},
		params: null,
	})

	async function onSubmit(values) {
		const success = await updateClient(client?._id, values, pathname)
		if (success) {
			router.push('/clients')
		}
	}

	async function onDelete() {
		setDeleteItem({
			id: client.id,
			title: client.full_name,
			action: deleteClient,
			params: [client.id, pathname],
			onSuccess: () => router.back()
		})
		onOpen()
	}

	return (
		<>
			<Confirmation
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				deleteItem={deleteItem}
			/>

			<Form {...form}>
				<form action={form.handleSubmit(onSubmit)} className='space-y-8'>
					<div className='form-container '>
						<FormField
							control={form.control}
							name='full_name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input className='form-input' placeholder='' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='dob'
							render={({ field }) => (
								<FormItem className='flex flex-col gap-1 mt-1'>
									<FormLabel>Date of Birth</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={''}
													className={cn(
														'w-[240px] pl-3 text-left font-normal',
														!field.value && 'text-muted-foreground',
														'form-input-bg '
													)}
												>
													{field.value ? (
														format(new Date(field.value), 'dd-LL-yyyy')
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
												initialFocus
												captionLayout='dropdown-buttons'
												fromYear={1940}
												toYear={2015}
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='tel'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Telephone</FormLabel>
									<FormControl>
										<Input className='form-input' placeholder='' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input className='form-input' placeholder='' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='passport'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Passport</FormLabel>
									<FormControl>
										<Input className='form-input' placeholder='' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='license'
							render={({ field }) => (
								<FormItem>
									<FormLabel>License</FormLabel>
									<FormControl>
										<Input className='form-input' placeholder='' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='nationality'
							render={({ field }) => (
								<FormItem>
									<div className='flex flex-col gap-2'>
										<FormLabel>Country of Issue</FormLabel>

										<Select
											className='form-input'
											defaultSelectedKeys={
												field.value ? [field.value] : undefined
											}
											isRequired
											size='sm'
											onChange={field.onChange}
										>
											{countries.map((country) => (
												<SelectItem key={country.code} textValue={country.name}>
													{country.name}
												</SelectItem>
											))}
										</Select>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='address'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Address</FormLabel>
									<FormControl>
										<Input className='form-input' placeholder='' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Card className='w-full flex flex-col'>
							<CardBody>
								<label>Documents</label>
								<Upload
									form={form}
									multiple={true}
									fieldName={'documents'}
									preset={'client'}
								/>
								<div className='flex gap-3 mt-2 flex-wrap'>
									{form.watch('documents').map((d) => {
										return (
											<CldImage
												key={d}
												className='bg-gray-400 p-1'
												// style={{ width: 5 + 'rem', height: 5 + 'rem' }}
												width={200}
												height={50}
												src={d}
											/>
										)
									})}
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='flex place-content-between'>
						<Button type='submit'>Submit</Button>
						{client && (
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
		</>
	)
}
