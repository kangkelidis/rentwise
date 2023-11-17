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
import { Input } from '@nextui-org/input'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectSection, SelectItem } from '@nextui-org/select'

import countries from '@/lib/data/countries.json' assert { type: 'json' }

import { cn } from '@/lib/utils'
// import { toast } from '@/components/ui/use-toast'

import { updateClient, deleteClient } from '@/lib/actions/client.actions'
import { clientValidationSchema } from '@/lib/validations/schemas'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { format } from 'date-fns'
import { Check, ChevronsUpDown, CalendarIcon } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import Upload from '../elements/Upload'
import { CldImage } from 'next-cloudinary'

export function ClientForm({ data }) {
	const router = useRouter()
	const pathname = usePathname()
	data = JSON.parse(data)
	const client = data.client
	const form = useForm({
		resolver: zodResolver(clientValidationSchema),
		defaultValues: {
			first_name: client?.first_name || '',
			last_name: client?.last_name || '',
			dob: client?.dob ? new Date(client.dob) : '',
			tel: client?.tel || '',
			email: client?.email || '',
			passport: client?.passport || '',
			license: client?.license || '',
			nationality: client?.nationality || '',
			address: client?.address || '',
			documents: client.documents || []
		},
	})

	async function onSubmit(values) {
		const success = await updateClient(client?._id, values, pathname)
		if (success) {
			router.push('/clients')
		}
	}

	async function onDelete() {
		const success = await deleteClient(client._id, pathname)
		if (success) {
			router.push('/clients')
		} else {
		}
	}

	return (
		<Form {...form}>
			<form action={form.handleSubmit(onSubmit)} className='space-y-8'>
				<div className='form-container'>
					<FormField
						control={form.control}
						name='first_name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input className='form-input' placeholder='' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='last_name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
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
							<FormItem className='flex flex-col'>
								<FormLabel>Date of Birth</FormLabel>
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


					<Upload form={form} multiple={true} fieldName={'documents'} preset={'client'}/>
					{form.watch('documents').map(d => {
						return (
							<CldImage
							key={d}
							className='bg-gray-400 p-1'
							style={{ width: 4 + 'rem', height: 4 + 'rem' }}
							width={30}
							height={30}
							src={d}
						/>
						)
					})}
						

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
	)
}
