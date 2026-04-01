'use client'

import { Chip } from '@nextui-org/chip'
import { useLocale } from '@/contexts/LocaleContext'

export default function StatusChip({ status }) {
	const { t } = useLocale()

	function getColor() {
		switch (status) {
			case 'draft':
				return 'default'
			case 'reserved':
				return 'secondary'
			case 'rented':
				return 'warning'
			case 'done':
				return 'success'
		}
	}

	function getTranslatedStatus() {
		switch (status) {
			case 'draft':
				return t('order.pending')
			case 'reserved':
				return t('order.confirmed')
			case 'rented':
				return t('order.inProgress')
			case 'done':
				return t('order.completed')
			default:
				return status
		}
	}

	return (
		<Chip color={getColor()} className='capitalize text-center min-w-full'>
			{getTranslatedStatus()}
		</Chip>
	)
}
