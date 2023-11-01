'use client'

// TODO use server action
import { getPrice } from '@/lib/price/rates'
import { changeSingleStateValue, dateDiffInDays, toCurrency } from '@/lib/utils'
import { Divider } from '@nextui-org/divider'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { useState } from 'react'
import { Tooltip } from '@nextui-org/tooltip'
import EditableInput from '../elements/EditableInput'

export default function Total({
	watch,
	vehicles,
	setPricePerDay,
	equipment,
	insurances,
	settings,
}) {
	const num_days = dateDiffInDays(watch.pick_up_date, watch.drop_off_date)
	const vehicle = vehicles.find((a) => a._id === watch.vehicle)
	const equip = equipment.filter((e) => e.count > 0)
	const insurance = insurances.find((i) => i.id === watch.insurance)

	let defaultPrice = {}
	let equipmentCustom = {}

	const vehicleTotal = getPrice(
		vehicle?.basic_day_rate,
		watch.pick_up_date,
		watch.drop_off_date
	)

	let extrasTotal = 0
	equip.forEach((e) => {
		const price_for_item =
			e.item.price_type === 'day'
				? (extrasTotal += e.item.price_per_day * num_days * e.count)
				: (extrasTotal += e.item.price_per_day * e.count)

		defaultPrice[e.item.name] = price_for_item
		equipmentCustom[e.item.name] = false
	})

	let insurance_total =
		insurance?.price_type === 'day'
			? insurance?.price_per_day * num_days
			: insurance?.price_per_day
	extrasTotal += insurance_total

	let extra_drivers_total_price =
		settings?.extra_driver_price_type === 'day'
			? settings?.extra_driver_price_per_day * num_days
			: settings?.extra_driver_price_per_day
	extra_drivers_total_price *= watch.extra_drivers.length

	defaultPrice = {
		...defaultPrice,
		vehicle_price: vehicleTotal,
		extra_drivers: extra_drivers_total_price,
		deposit_amount: insurance?.deposit_amount,
		deposit_excess: insurance?.deposit_excess,
		insurance_price: insurance_total,
	}

	setPricePerDay(vehicleTotal / num_days)
	const [isCustom, setIsCustom] = useState({
		vehicle_price: false,
		extra_drivers: false,
		deposit_amount: false,
		deposit_excess: false,
		insurance_price: false,
		...equipmentCustom,
	})
	const [customPrice, setCustomPrice] = useState(defaultPrice)

	const customProps = {
		isCustom: isCustom,
		setIsCustom: setIsCustom,
		customPrice: customPrice,
		setCustomPrice: setCustomPrice,
		defaultPrice: defaultPrice,
	}
	
	function getTotalPrice() {
		return Object.values(customPrice).reduce((prev, curr) => (prev+curr)) - customPrice.deposit_amount - customPrice.deposit_excess
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
							<EditableInput name='vehicle_price' {...customProps} size='lg' />
						</span>
						{isCustom.vehicle_price && (
							<p className=' self-end line-through'>
								{toCurrency(vehicleTotal)}
							</p>
						)}

						<span className=' w-full flex justify-between'>
							<p className='text-subtle-medium'>Tariff</p>
							<p className=' text-small-regular'>
								{toCurrency(customPrice.vehicle_price / num_days)} / day
							</p>
						</span>
						<span className=' w-full flex justify-between'>
							<p className='text-subtle-medium'>VAT inc.</p>
							<p className=' text-small-regular'>
								{toCurrency((customPrice.vehicle_price * 19) / 100)}{' '}
							</p>
						</span>
						<Divider className='my-1' />

						<div>
							<p className='text-heading4-medium'>Extras</p>
							{watch.extra_drivers.length > 0 && (
								<div className='flex flex-col'>
									<div className='flex justify-between'>
										<p className='text-small-regular'>
											Extra driver (x{watch.extra_drivers.length})
										</p>
										<p className={`text-tiny ${isCustom.extra_drivers ? 'line-through' : ''}`}>
											{toCurrency(settings?.extra_driver_price_per_day)}
										</p>
										<EditableInput name={'extra_drivers'} {...customProps} />
									</div>
									{isCustom.extra_drivers && (
										<p className=' self-end line-through'>
											{toCurrency(extra_drivers_total_price)}
										</p>
									)}
								</div>
							)}
							{equip.map((extra) => (
								<div className='flex flex-col'>
									<div key={extra.item.id} className='flex justify-between'>
										<p className='text-small-regular'>{`${extra.item.name} (x${extra.count})`}</p>
										<p className={`text-tiny ${isCustom[extra.item.name] ? 'line-through' : ''}`}>
											{toCurrency(extra.item.price_per_day)}
										</p>
										<EditableInput name={extra.item.name} {...customProps} />
									</div>
									{isCustom[extra.item.name] && (
										<p className=' self-end line-through'>
											{toCurrency(defaultPrice[extra.item.name])}
										</p>
									)}
								</div>
							))}
							<div className='flex flex-col'>
							<div className='flex justify-between'>
								<p className='text-small-regular'>{insurance?.name}</p>
								<p className={`text-tiny ${isCustom.insurance_price ? 'line-through' : ''}`}>
									{toCurrency(insurance?.price_per_day)}
								</p>
								<EditableInput name={'insurance_price'} {...customProps} />

							</div>
							{isCustom.insurance_price && (
										<p className=' self-end line-through'>
											{toCurrency(defaultPrice.insurance_price)}
										</p>
									)}
									</div>
						</div>
						<Divider className='my-1' />

						<div>
							<p className='text-heading4-medium'>Taxes</p>
							<div className='flex justify-between'>
								<p className='text-small-regular'>VAT 19% inc</p>
								<p>{toCurrency((19 / 100) * (vehicleTotal + extrasTotal))}</p>
							</div>
						</div>

						<Divider className='my-1' />

						<div className='flex flex-col gap-3'>
							<p className='text-heading4-medium'>Deposit</p>

							<div className='flex justify-between'>
								<p className='text-small-regular'>Security deposit</p>
								<EditableInput
									{...customProps}
									name={'deposit_amount'}
									size='lg'
								/>
							</div>
							{isCustom.deposit_amount && (
								<p className=' self-end line-through'>
									{toCurrency(insurance?.deposit_amount)}
								</p>
							)}

							<div className='flex justify-between'>
								<p className='text-small-regular'>Damage excess:</p>
								<EditableInput
									{...customProps}
									name={'deposit_excess'}
									size='lg'
								/>
							</div>
							{isCustom.deposit_excess && (
								<p className=' self-end line-through'>
									{toCurrency(insurance?.deposit_excess)}
								</p>
							)}
						</div>
					</div>
				)}
				<div className='flex justify-between'>
					<p className='text-base-semibold'>Due Balance</p>
					<p className=''>
						{toCurrency(getTotalPrice())}
					</p>
				</div>
			</div>
		</div>
	)
}
