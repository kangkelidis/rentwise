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
    data = JSON.parse(data)

	const form = useForm({
		resolver: zodResolver(settingsValidationSchema),
		defaultValues: {
			company_name: data?.company_name || '',
			company_signature: data?.company_signature || '',
		},
	})

	async function onSubmit(values) {

        const success = await updateSettings(values, pathname)
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
									<Input className='form-input' isRequired placeholder='' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

                    <FormField
						control={form.control}
						name='company_signature'
						render={({ field }) =>  {
                            const src = field.value !== '' ? field.value : data.company_signature                            
                            return (
							<FormItem>
								<FormLabel>Company Signature</FormLabel>
								<FormControl>
                                    <Signature field={...field} form={form}/>
								</FormControl>
								<FormMessage />
                                
                                    <Image 
                                        width={100}
                                        height={100}
                                        alt='signature'
                                        src={src}
                                    />
							</FormItem>
						)}}
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
