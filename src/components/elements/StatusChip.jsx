'use client'

import { Chip } from '@nextui-org/chip'

export default function StatusChip({ status }) {
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
	return (
		<Chip color={getColor()} className='capitalize text-center min-w-full'>
			{status}
		</Chip>
	)
}
