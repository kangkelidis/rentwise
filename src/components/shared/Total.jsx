'use client'

// TODO use server action
import { getNormalPrices, getPrice, getTotalPrice } from '@/lib/price/rates'
import {
	changeSingleStateValue,
	dateDiffInDays,
	hasCustomPrice,
	toCurrency,
} from '@/lib/utils'
import { Divider } from '@nextui-org/divider'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { useEffect, useState } from 'react'
import { Tooltip } from '@nextui-org/tooltip'
import EditableInput from '../elements/EditableInput'

export default function Total(props) {
	console.log('total', props.watch);

	const num_days = dateDiffInDays(
		props.watch.pick_up_date,
		props.watch.drop_off_date
	)
	const vehicle = props.vehicles.find((v) => v.id === props.watch.vehicle)
	const selectedEquip = props.equipment.filter((e) => e.count > 0)
	const insurance = props.insurances.find((i) => i.id === props.watch.insurance)

	const editableInputProps = {
		customPrices: props.customPrices,
		setCustomPrices: props.setCustomPrices,
		normalPrices: props.normalPrices,
		prices: props.prices,
		setPrices: props.setPrices,
	}

	return (
		<div className='sticky top-[50px]'>
			<div className=' bg-primary-500 p-3 w-full rounded-t-lg'>
				<h2 className=' text-heading3-bold'>Summary</h2>
			</div>
			<div className='flex flex-col p-4 gap-2 bg-zinc-900 rounded-b-lg rounded-t-none'>
				<span className=' w-full flex justify-between'>
					<p>Rental period</p> <p className=' font-bold'>{num_days} days</p>
				</span>
				{vehicle && (
					<div className='bg-slate-700 -mx-4 p-4 flex gap-3 flex-col'>
						<p className='text-heading4-medium'>{vehicle.group.name}</p>
						<span className=' w-full flex justify-between gap-10'>
							<p>{vehicle.make + ' ' + vehicle.model}</p>
							{props.prices.vehicle?.total >= 0 && (
								<EditableInput
									name='vehicle'
									{...editableInputProps}
									size='lg'
								/>
							)}
						</span>
						{hasCustomPrice('vehicle', props.prices) && (
							<p className=' self-end line-through'>
								{toCurrency(props.prices.vehicle.total)}
							</p>
						)}

						<span className=' w-full flex justify-between'>
							<p className='text-subtle-medium'>Tariff</p>
							<p className=' text-small-regular'>
								{toCurrency(
									hasCustomPrice('vehicle', props.prices)
										? props.prices.vehicle?.custom / num_days
										: props.prices.vehicle?.total / num_days
								)}{' '}
								/ day
							</p>
						</span>
						<span className=' w-full flex justify-between'>
							<p className='text-subtle-medium'>VAT inc.</p>
							<p className=' text-small-regular'>
								{toCurrency(
									((props.prices.vehicle?.custom ||
										props.prices.vehicle?.total) *
										19) /
										100
								)}{' '}
							</p>
						</span>
						<Divider className='my-1' />

						<div>
							<p className='text-heading4-medium'>Extras</p>
							{props.watch.extra_drivers.length > 0 && (
								<div className='flex flex-col'>
									<div className='flex justify-between'>
										<p className='text-small-regular'>
											Extra driver (x{props.watch.extra_drivers.length})
										</p>
										<p
											className={`text-tiny ${
												hasCustomPrice('drivers', props.prices)
													? 'line-through'
													: ''
											}`}
										>
											{toCurrency(
												props.prices.drivers.total /
													num_days /
													props.watch.extra_drivers.length
											)}
										</p>
										{props.prices.drivers.total >= 0 && (
											<EditableInput name={'drivers'} {...editableInputProps} />
										)}
									</div>
									{hasCustomPrice('drivers', props.prices) && (
										<p className=' self-end line-through'>
											{toCurrency(props.prices.drivers.total)}
										</p>
									)}
								</div>
							)}

							{selectedEquip.map((extra) => (
								<div className='flex flex-col'>
									{props.prices.equipment?.[extra.item.name]?.total >= 0 && (
										<div key={extra.item.id} className='flex justify-between'>
											<p className='text-small-regular'>{`${extra.item.name} (x${extra.count})`}</p>
											<p
												className={`text-tiny ${
													hasCustomPrice(extra.item.name, props.prices, true)
														? 'line-through'
														: ''
												}`}
											>
												{toCurrency(extra.item.price_per_day)}{' '}
												{extra.item.price_type === 'day' ? '/ day' : 'each'}
											</p>

											<EditableInput
												name={extra.item.name}
												equipment
												{...editableInputProps}
											/>
										</div>
									)}
									{hasCustomPrice(extra.item.name, props.prices, true) && (
										<p className=' self-end line-through'>
											{toCurrency(
												props.prices.equipment?.[extra.item.name].total
											)}
										</p>
									)}
								</div>
							))}

							{props.prices?.insurance?.total >= 0 && (
								<div className='flex flex-col'>
									<div className='flex justify-between'>
										<p className='text-small-regular'>{insurance?.name}</p>
										<p
											className={`text-tiny ${
												hasCustomPrice('insurance', props.prices)
													? 'line-through'
													: ''
											}`}
										>
											{props.prices.insurance.type === 'fix'
												? toCurrency(props.prices.insurance.total) + ' fix'
												: toCurrency(props.prices.insurance.total / num_days) +
												  ' /day'}
										</p>
										<EditableInput name={'insurance'} {...editableInputProps} />
									</div>
									{hasCustomPrice('insurance', props.prices) && (
										<p className=' self-end line-through'>
											{toCurrency(props.prices.insurance.total)}
										</p>
									)}
								</div>
							)}
						</div>

						<Divider className='my-1' />

						<div>
							<p className='text-heading4-medium'>Taxes</p>
							<div className='flex justify-between'>
								<p className='text-small-regular'>VAT 19% inc</p>
								<p>{toCurrency((19 / 100) * getTotalPrice(props.prices))}</p>
							</div>
						</div>

						<Divider className='my-1' />

						<div className='flex flex-col gap-3'>
							<p className='text-heading4-medium'>Deposit</p>

							<div className='flex justify-between'>
								<p className='text-small-regular'>Security deposit</p>
								<EditableInput
									{...editableInputProps}
									name={'deposit'}
									size='lg'
								/>
							</div>
							{hasCustomPrice('deposit', props.prices) && (
								<p className=' self-end line-through'>
									{toCurrency(props.prices.deposit.total)}
								</p>
							)}

							<div className='flex justify-between'>
								<p className='text-small-regular'>Damage excess:</p>
								<EditableInput
									{...editableInputProps}
									name={'excess'}
									size='lg'
								/>
							</div>
							{hasCustomPrice('excess', props.prices) && (
								<p className=' self-end line-through'>
									{toCurrency(props.prices.excess.total)}
								</p>
							)}
						</div>
					</div>
				)}
				<div className='flex justify-between'>
					<p className='text-base-semibold'>Due Balance</p>
					<p className=''>{toCurrency(getTotalPrice(props.prices))}</p>
				</div>
			</div>
		</div>
	)
}
