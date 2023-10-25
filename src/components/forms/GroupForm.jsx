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
import { useDisclosure } from '@nextui-org/react'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { groupValidationSchema } from '@/lib/validations/schemas'
import { updateGroup } from '@/lib/actions/group.actions'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function GroupForm({ group }) {
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

	const form = useForm({
		resolver: zodResolver(groupValidationSchema),})

	useEffect(() => {
		if (group) {
			group = JSON.parse(group)
			form.setValue('name', group.name)
			onOpenChange()
		}

	}, [searchParams])

	const router = useRouter()


	async function onSubmit(event) {
		if (typeof group === 'string') {
			group = JSON.parse(group)
		}
		const values = form.getValues()
		await updateGroup(group?._id, values, pathname)
		
		group = undefined
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
				Add Group
			</Button>
			<Modal
				isOpen={isOpen}
				backdrop='blur'
				onClose={() => {
					group = undefined
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
									{group ? 'Edit Group' : 'Add Group'}
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
														<FormLabel>Group Name</FormLabel>
														<FormControl>
															<Input placeholder='Ex. Economy' {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<Button
												type='button'
												color='primary'
												onPress={onSubmit}
											>
												{group ? 'Update' : 'Add'}
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
