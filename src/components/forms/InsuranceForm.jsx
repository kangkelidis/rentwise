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
import { Checkbox } from '@nextui-org/checkbox'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { insuranceValidationSchema } from '@/lib/validations/schemas'
import { updateExtra } from '@/lib/actions/extras.actions'
import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function InsuranceForm({ insurance }) {
	const pathname = usePathname()
    const searchParams = useSearchParams()

	const [isDepositSelected, setDepositSelected] = useState(true)
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
	const form = useForm({
		resolver: zodResolver(insuranceValidationSchema),
	})

    useEffect(() => {
		if (insurance) {
            insurance = JSON.parse(insurance)
            form.setValue('name', insurance.name)
            form.setValue('price_per_day', insurance.price_per_day)
            form.setValue('price_type', insurance.price_type)
            form.setValue('deposit_amount', insurance.deposit_amount)
            form.setValue('deposit_excess', insurance.deposit_excess)
			onOpenChange()
		}

	}, [searchParams])

	const router = useRouter()

	async function onSubmit(event) {
		if (typeof insurance === 'string') {
			insurance = JSON.parse(insurance)
		}
		const values = form.getValues()
        values.category = 'insurance'
		await updateExtra(insurance?._id, values, pathname)
		
		insurance = undefined
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
				Add Insurance
			</Button>
			<Modal
				isOpen={isOpen}
				backdrop='blur'
				onClose={() => {
                    insurance = undefined
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
									Add Insurance
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
														<FormLabel>Insurance Name</FormLabel>
														<FormControl>
															<Input placeholder='Ex. SDW' {...field} />
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

											<Checkbox
												isSelected={isDepositSelected}
												onValueChange={setDepositSelected}
											>
												Security Deposit
											</Checkbox>

											{isDepositSelected && (
												<div>
													<FormField
														control={form.control}
														name='deposit_amount'
														render={({ field }) => (
															<FormItem>
																<FormLabel>Deposit Amount</FormLabel>
																<FormControl>
																	<Input
																		type='number'
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
														name='deposit_excess'
														render={({ field }) => (
															<FormItem>
																<FormLabel>Excess Amount</FormLabel>
																<FormControl>
																	<Input
																		type='number'
																		placeholder=''
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											)}
										</form>
									</Form>
								</ModalBody>

								<ModalFooter>
									<Button
										type='submit'
										color='primary'
										onPress={onSubmit}
									>
										{insurance ? 'Update' : 'Add'}
									</Button>
								</ModalFooter>
							</>
						)
					}}
				</ModalContent>
			</Modal>
		</>
	)
}
