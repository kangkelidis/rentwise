'use client'

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from '@nextui-org/modal'
import LoadingButton from '@/components/ui/loadingButton'
import { Button } from '@nextui-org/react'
import { useState } from 'react'

export default function Confirmation({ isOpen, onOpenChange, deleteItem }) {
	const [isLoading, setIsLoading] = useState(false)

	return (
		<Modal
			isOpen={isOpen}
			backdrop='blur'
			onOpenChange={onOpenChange}
			placement='top-center'
		>
			<ModalContent>
				{(onClose) => {
					return (
						<>
							<ModalHeader>Confirmation</ModalHeader>

							<ModalBody>
								Are you sure you want to delete {deleteItem.title} ?
							</ModalBody>
							<ModalFooter>
								<LoadingButton
									isLoading={isLoading}
									onPress={async () => {
										setIsLoading(true)
										await deleteItem.action(...deleteItem.params)
                                        onClose()
                                        deleteItem.onSuccess()
										setIsLoading(false)
									}}
								>
									Yes
								</LoadingButton>
								<Button onPress={() => onClose()}>Cancel</Button>
							</ModalFooter>
						</>
					)
				}}
			</ModalContent>
		</Modal>
	)
}
