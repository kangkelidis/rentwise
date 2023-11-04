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
import { Select, SelectItem } from '@nextui-org/react'

// import { toast } from '@/components/ui/use-toast'

import { fetchSettings, updateSettings } from '@/lib/actions/settings.action'
import { settingsValidationSchema } from '@/lib/validations/schemas'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import Signature from '../elements/Signature'
import Image from 'next/image'

export function SettingsForm({ data }) {
	const router = useRouter()
	const pathname = usePathname()
	try {
		data = JSON.parse(data)
	} catch (error) {}
//TODO: move etra driver price to rentals settings
	const form = useForm({
		resolver: zodResolver(settingsValidationSchema),
		defaultValues: {
			company_name: data?.company_name || '',
			company_signature: data?.company_signature || '',
			terms_conditions: data?.terms_conditions || '',
			extra_driver_price_type: data?.extra_driver_price_type || '',
			extra_driver_price_per_day: data?.extra_driver_price_per_day || '',
		},
	})

	async function onSubmit(values) {
		const success = await updateSettings(data.users, values, pathname)
		if (success) {
			router.push('/settings')
		}
	}

	return (
		<Form {...form}>
			<form action={form.handleSubmit(onSubmit)} className='space-y-8'>
				<div className='form-container'>
					<FormField
						control={form.control}
						name='company_name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company Name</FormLabel>
								<FormControl>
									<Input
										className='form-input'
										isRequired
										placeholder=''
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='company_signature'
						render={({ field }) => {
							const src =
								field.value !== '' ? field.value : data.company_signature
							return (
								<FormItem>
									<FormLabel>Company Signature</FormLabel>
									<FormControl>
										<Signature field={field} form={form} />
									</FormControl>
									<FormMessage />

									<Image width={100} height={100} alt='signature' src={src} />
								</FormItem>
							)
						}}
					/>

					<div>
						<h2>Extra Drivers</h2>
						<FormField
							control={form.control}
							name='extra_driver_price_type'
							render={({ field }) => (
								<FormItem>
									<Select
										className='form-input'
										onChange={field.onChange}
										defaultSelectedKeys={
											field.value ? [field.value] : undefined
										}
										label='Price Calculation'
										labelPlacement='outside'
										isRequired
										size='md'
									>
										<SelectItem key={'day'}>Per day</SelectItem>
										<SelectItem key={'fix'}>Fix</SelectItem>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='extra_driver_price_per_day'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input type='number' placeholder='' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
				<div className='flex place-content-between'>
					<Button type='submit' color='primary'>
						Submit
					</Button>

					<Button type='button' color='secondary' onClick={() => router.back()}>
						Back
					</Button>
				</div>
			</form>
		</Form>
	)
}
