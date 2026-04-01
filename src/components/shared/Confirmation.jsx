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
import { useLocale } from '@/contexts/LocaleContext'

export default function Confirmation({ isOpen, onOpenChange, deleteItem }) {
	const { t } = useLocale()
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
							<ModalHeader>{t('common.confirmation')}</ModalHeader>

							<ModalBody>
								{t('messages.confirmDelete')} {deleteItem.title} ?
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
									{t('common.yes')}
								</LoadingButton>
								<Button onPress={() => onClose()}>{t('common.cancel')}</Button>
							</ModalFooter>
						</>
					)
				}}
			</ModalContent>
		</Modal>
	)
}
