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
	const [error, setError] = useState('')

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
								{error && <p className='text-red-500'>{error}</p>}
							</ModalBody>
							<ModalFooter>
								<LoadingButton
									isLoading={isLoading}
									onPress={async () => {
										if (isLoading) return

										setIsLoading(true)
										setError('')
										try {
											await deleteItem.action(...deleteItem.params)
											onClose()
											deleteItem.onSuccess?.()
										} catch (error) {
											setError(error?.message || t('messages.errorOccurred'))
										} finally {
											setIsLoading(false)
										}
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
