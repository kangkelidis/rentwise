'use client'

// TODO use server action
import { getPrice, getTotalPrice } from '@/lib/price/rates'
import { changeSingleStateValue, dateDiffInDays, hasCustomPrice, toCurrency } from '@/lib/utils'
import { Divider } from '@nextui-org/divider'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { useEffect, useState } from 'react'
import { Tooltip } from '@nextui-org/tooltip'
import EditableInput from '../elements/EditableInput'

// TODO: refactror. must rethink default price as a variable, use state without rerenders
export default function Total(props) {
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
	}

	return (
		<div className=''>
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
							{props.normalPrices.vehicle && (
								<EditableInput
									name='vehicle'
									{...editableInputProps}
									size='lg'
								/>
							)}
						</span>
						{hasCustomPrice('vehicle', props.customPrices) && (
							<p className=' self-end line-through'>
								{toCurrency(props.normalPrices.vehicle)}
							</p>
						)}

						<span className=' w-full flex justify-between'>
							<p className='text-subtle-medium'>Tariff</p>
							<p className=' text-small-regular'>
								{toCurrency(hasCustomPrice('vehicle', props.customPrices) ? props.customPrices.vehicle / num_days : vehicle.basic_day_rate)} / day
							</p>
						</span>
						<span className=' w-full flex justify-between'>
							<p className='text-subtle-medium'>VAT inc.</p>
							<p className=' text-small-regular'>
								{toCurrency((props.customPrices.vehicle * 19) / 100)}{' '}
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
												props.customPrices.drivers >= 0 ? 'line-through' : ''
											}`}
										>
											{toCurrency(props.normalPrices.drivers / num_days / props.watch.extra_drivers.length )}
										</p>
										{props.normalPrices.drivers > 0 && (
											<EditableInput name={'drivers'} {...editableInputProps} />
										)}
									</div>
									{props.customPrices.drivers >= 0 && (
										<p className=' self-end line-through'>
											{toCurrency(props.normalPrices.drivers)}
										</p>
									)}
								</div>
							)}

							{selectedEquip.map((extra) => (
								
								<div className='flex flex-col'>
								{ props.normalPrices[extra.item.name] >= 0 &&
									<div key={extra.item.id} className='flex justify-between'>
										<p className='text-small-regular'>{`${extra.item.name} (x${extra.count})`}</p>
										<p
											className={`text-tiny ${
												props.customPrices[extra.item.name] >= 0
													? 'line-through'
													: ''
											}`}
										>
											{toCurrency(extra.item.price_per_day)}
										</p>

											<EditableInput
												name={extra.item.name}
												{...editableInputProps}
											/>
									</div>
										}
									{props.customPrices[extra.item.name] >= 0 && (
										<p className=' self-end line-through'>
											{toCurrency(props.normalPrices[extra.item.name])}
										</p>
									)}
								</div>
							))}

							{props.normalPrices.insurance >= 0 && (
								<div className='flex flex-col'>
									<div className='flex justify-between'>
										<p className='text-small-regular'>{insurance?.name}</p>
										<p
											className={`text-tiny ${
												props.customPrices.insurance >= 0 ? 'line-through' : ''
											}`}
										>
											{toCurrency(insurance?.price_per_day)}
										</p>
										<EditableInput name={'insurance'} {...editableInputProps} />
									</div>
									{props.customPrices.insurance >= 0 && (
										<p className=' self-end line-through'>
											{toCurrency(props.normalPrices.insurance)}
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
								<p>{toCurrency((19 / 100) * (getTotalPrice(props.customPrices, props.normalPrices)))}</p>
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
							{hasCustomPrice('deposit', props.customPrices) && (
								<p className=' self-end line-through'>
									{toCurrency(props.normalPrices.deposit)}
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
							{props.customPrices.excess >= 0 && (
								<p className=' self-end line-through'>
									{toCurrency(props.normalPrices.excess)}
								</p>
							)}
						</div>
					</div>
				)}
				<div className='flex justify-between'>
					<p className='text-base-semibold'>Due Balance</p>
					<p className=''>{toCurrency(getTotalPrice(props.customPrices, props.normalPrices))}</p>
				</div>
			</div>
		</div>
	)
}
