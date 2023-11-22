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

export default function OrderCard({ order, type, settings }) {
	const timeTill = formatDateDifference(
		new Date(),
		new Date(order[type + '_date'])
	)
	return (
		<Card
			className={`h-[10rem] border-2 ${
				type === 'pick_up' ? 'border-green-500' : 'border-yellow-500'
			} ${!timeTill && 'bg-red-400 bg-opacity-10'}
			
			`}
		>
			<CardBody className='h-full flex flex-row flex-wrap gap-3 w-full justify-between'>
				<div className=''>
					<span className='block text-subtle-semibold text-gray-400 mb-1'>
						Time
					</span>
					<span
						className={`capitalize text-body-bold ${
							type === 'pick_up' ? 'text-green-500' : 'text-yellow-500'
						}`}
					>
						{type.replace('_', ' ')}
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

				<Divider orientation='vertical' />

				<div>
					<span className='block text-subtle-semibold text-gray-400 mb-1'>
						Location
					</span>

					{order[type + '_location']}
				</div>

				<Divider orientation='vertical' />

				<div>
					<span className='block text-subtle-semibold text-gray-400 mb-1'>
						Client
					</span>

					{order.client.full_name}
				</div>

				<Divider orientation='vertical' />

				<div className=''>
					<span className='block text-subtle-semibold text-gray-400 mb-1'>
						Vehicle
					</span>
					<VehicleDetails vehicle={order.vehicle} />
				</div>

				<Divider orientation='vertical' />

				<div className='flex flex-col'>
					<span className='block text-subtle-semibold text-gray-400 mb-1'>
						Detail
					</span>

					<span>Insurance: {order.insurance.name}</span>
					<span>Deposit: {toCurrency(order.insurance.deposit_amount)}</span>
					<span>Total: {toCurrency(getTotalPrice(order.prices))}</span>
				</div>

				<Divider orientation='vertical' />

				<div className='flex flex-col'>
					<span className='block text-subtle-semibold text-gray-400 mb-1'>
						Actions
					</span>

					<Link href={'/orders/' + order.id}>
						<Button>View Order</Button>
					</Link>
					<Agreement prices={order.prices} order={order} settings={settings} />
				</div>

				<Divider orientation='vertical' />

				<div>
				<span className='block text-subtle-semibold text-gray-400 mb-1'>
						Status
					</span>	
					<StatusChip status={order.status}/>
				</div>

			</CardBody>
		</Card>
	)
}
