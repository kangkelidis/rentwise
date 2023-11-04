'use client'

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from '@nextui-org/modal'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Select, SelectItem, useDisclosure } from '@nextui-org/react'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { equipValidationSchema } from '@/lib/validations/schemas'
import { updateExtra } from '@/lib/actions/extras.actions'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function EquipmentForm({ equipment }) {
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
	const form = useForm({
		resolver: zodResolver(equipValidationSchema),
	})

	useEffect(() => {
		if (equipment) {
			try {
				equipment = JSON.parse(equipment)
			} catch (error) {}
			form.setValue('name', equipment.name)
			form.setValue('price_per_day', equipment.price_per_day)
			form.setValue('price_type', equipment.price_type)
			onOpenChange()
		}
	}, [searchParams])

	const router = useRouter()

	async function onSubmit(event) {
		if (typeof equipment === 'string') {
			equipment = JSON.parse(equipment)
		}
		const values = form.getValues()
		values.category = 'equipment'
		await updateExtra(equipment?._id, values, pathname)

		equipment = undefined
		onClose()
		router.push(pathname)
	}
	async function onErrors(values) {}
	return (
		<>
			<Button
				onPress={() => {
					form.reset()
					onOpen()
				}}
				color='primary'
			>
				Add Equipment
			</Button>
			<Modal
				isOpen={isOpen}
				backdrop='blur'
				onClose={() => {
					equipment = undefined
					onClose()
					router.push(pathname)
				}}
				onOpenChange={onOpenChange}
				placement='top-center'
			>
				<ModalContent>
					{(onClose) => {
						return (
							<>
								<ModalHeader className='flex flex-col gap-1'>
									Add Equipment
								</ModalHeader>
								<ModalBody>
									<Form {...form}>
										<form
											action={form.handleSubmit(onSubmit, onErrors)}
											className='space-y-8'
										>
											<FormField
												control={form.control}
												name='name'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Equipment Name</FormLabel>
														<FormControl>
															<Input placeholder='Ex. Baby Seat' {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name='price_type'
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
												name='price_per_day'
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

											<Button type='submit' color='primary' onPress={onSubmit}>
												{equipment ? 'Update' : 'Add'}
											</Button>
										</form>
									</Form>
								</ModalBody>

								<ModalFooter></ModalFooter>
							</>
						)
					}}
				</ModalContent>
			</Modal>
		</>
	)
}
