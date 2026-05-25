'use client'

import { Card, CardBody } from '@nextui-org/card'
import { Divider } from '@nextui-org/divider'
import React from 'react'
import VehicleDetails from './vehicle-details'
import { formatDateDifference, toCurrency } from '@/lib/utils'
import { getTotalPrice } from '@/lib/price/rates'
import Agreement from '../shared/Agreement'
import Link from 'next/link'
import { Button } from '@nextui-org/button'
import StatusChip from './StatusChip'
import { useLocale } from '@/contexts/LocaleContext'
import { getClientDisplayName, getRecordId } from '@/lib/client-display'

const cellClass ='border-[0.1px] border-gray-500 p-4 grow  '
export default function OrderCard({ order, type, settings }) {
	const { t } = useLocale()

	// Add safety checks
	if (!order) {
		return <div className="text-gray-500">{t('messages.noDataFound')}</div>
	}

	const timeTill = formatDateDifference(
		new Date(),
		new Date(order[type + '_date'])
	)
	const clientId = getRecordId(order.client)
	const clientName = getClientDisplayName(order.client, t('client.missingClient'))
	const canPrintAgreement = Boolean(order.client && clientId)

	return (
		<div
			className={` rounded-lg border-2 ${
				type === 'pick_up' ? 'border-green-500' : 'border-yellow-500'
			} ${!timeTill && 'bg-red-400 bg-opacity-10'}

			`}
		>
			<div className='flex flex-row w-full max-sm:flex-col '>
				<div className={cellClass}>
						<span className='block text-subtle-semibold text-gray-400 mb-1'>
							{t('common.time')}
						</span>
						<span
							className={`capitalize text-body-bold ${
								type === 'pick_up' ? 'text-green-500' : 'text-yellow-500'
							}`}
						>
							{type === 'pick_up' ? t('order.pickup') : t('order.return')}
						</span>
						<div
							className={`text-heading2-bold ${
								type === 'pick_up' ? 'text-green-500' : 'text-yellow-500'
							}`}
						>
							{new Date(order[type + '_date']).toLocaleTimeString('en-GB', {
								hour: '2-digit',
								minute: '2-digit',
							})}
						</div>
						<span className={!timeTill && 'text-red-500'}>{timeTill ? timeTill : 'passed'}</span>

				</div>


				<div className={cellClass}>
					<span className='block text-subtle-semibold text-gray-400 mb-1'>
						{t('common.location')}
					</span>

					{order[type + '_location']}
				</div>


				<div className={cellClass}>
					<span className='block text-subtle-semibold text-gray-400 mb-1'>
						{t('client.client')}
					</span>

					{clientId ? (
						<Link href={`/clients/${clientId}`}>{clientName}</Link>
					) : (
						<span className='text-red-500'>{clientName}</span>
					)}
				</div>


				<div className={cellClass}>
					<span className='block text-subtle-semibold text-gray-400 mb-1'>
						{t('vehicle.vehicle')}
					</span>
					{order.vehicle ? (
						<VehicleDetails vehicle={order.vehicle} />
					) : (
						<p className="text-gray-500">{t('vehicle.noVehicleAssigned')}</p>
					)}
				</div>


				<div className={cellClass}>
					<span className='block text-subtle-semibold text-gray-400 mb-1'>
						{t('order.orderDetails')}
					</span>

					<span className='block'>{t('order.insurance')}: {order.insurance?.name}</span>
					<span className='block'>{t('order.deposit')}: {toCurrency(order.insurance?.deposit_amount)}</span>
					<span className='block'>{t('order.totalAmount')}: {toCurrency(getTotalPrice(order.prices))}</span>
				</div>


				<div className={cellClass}>
					<span className='block text-subtle-semibold text-gray-400 mb-1'>
						{t('common.actions')}
					</span>
					<div className='flex flex-col gap-1'>

					<Link href={'/orders/' + order.id}>
						<Button>{t('order.viewOrder')}</Button>
					</Link>
					<Agreement
						prices={order.prices}
						order={order}
						settings={settings}
						isDisabled={!canPrintAgreement}
					/>
					</div>
				</div>


				<div className={cellClass}>
				<span className='block text-subtle-semibold text-gray-400 mb-1'>
						{t('common.status')}
					</span>
					<StatusChip status={order.status}/>
				</div>

			</div>
		</div>
	)
}
