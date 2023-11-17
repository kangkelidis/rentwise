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
import { Input, Textarea } from '@nextui-org/input'
import Signature from '@/components/elements/Signature'
import Image from 'next/image'
import { useState } from 'react'
import Upload from '@/components/elements/Upload'
import { CldImage } from 'next-cloudinary'

export function SettingsForm({ data }) {
	const router = useRouter()
	const pathname = usePathname()
	try {
		data = JSON.parse(data)
	} catch (error) {}

	const form = useForm({
		resolver: zodResolver(settingsValidationSchema),
		defaultValues: {
			company: data?.company || {},
		},
	})
	console.log(form.watch())

	async function onSubmit(values) {
		console.log(values)
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
						name='company.name'
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
						name='company.slogan'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company Slogan</FormLabel>
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
						name='company.address.line1'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company Address Line 1</FormLabel>
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
						name='company.address.line2'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company Address Line 2</FormLabel>
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
						name='company.vat'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company VAT NO</FormLabel>
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
						name='company.tel'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company Tel</FormLabel>
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
						name='company.email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company Email</FormLabel>
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
						name='company.website'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company Website</FormLabel>
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
						name='company.terms'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										className=' form-input sm:!w-[550px]'
										required={false}
										label='Terms And Conditions'
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
						name='company.signature'
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

					<Upload form={form} fieldName={'company.logo'} preset='cmtqcrgs' />
					<CldImage
						className='bg-gray-400 p-1'
						style={{ width: 4 + 'rem', height: 4 + 'rem' }}
						width={30}
						height={30}
						src={form.watch('company.logo')}
					/>
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
