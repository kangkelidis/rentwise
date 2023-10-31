'use client'

// TODO use server action
import { getPrice } from '@/lib/price/rates'
import { dateDiffInDays, toCurrency } from '@/lib/utils'
import { Divider } from '@nextui-org/divider'

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
	
	const vehicleTotal = getPrice(
		vehicle?.basic_day_rate,
		watch.pick_up_date,
		watch.drop_off_date
		)

	let extrasTotal = 0
	equip.forEach((e) => {
		e.item.price_type === 'day'
			? (extrasTotal += e.item.price_per_day * num_days * e.count)
			: (extrasTotal += e.item.price_per_day * e.count)
	})

	extrasTotal +=
		insurance?.price_type === 'day'
			? insurance?.price_per_day * num_days
			: insurance?.price_per_day

	let extra_drivers_total_price =
			settings?.extra_driver_price_type === 'day'
				? settings?.extra_driver_price_per_day * num_days
				: settings?.extra_driver_price_per_day
	extra_drivers_total_price *= watch.extra_drivers.length 

	setPricePerDay(vehicleTotal / num_days)

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
							<p className='text-body-semibold'>{toCurrency(vehicleTotal)}</p>
						</span>
						<span className=' w-full flex justify-between'>
							<p className='text-subtle-medium'>Tariff</p>
							<p className=' text-small-regular'>
								{toCurrency(vehicleTotal / num_days)} / day
							</p>
						</span>
						<span className=' w-full flex justify-between'>
							<p className='text-subtle-medium'>VAT inc.</p>
							<p className=' text-small-regular'>
								{toCurrency((vehicleTotal * 19) / 100)}{' '}
							</p>
						</span>
						<Divider className='my-1' />

						<div>
							<p className='text-heading4-medium'>Extras</p>
							{watch.extra_drivers.length > 0 && (
								<div className='flex justify-between'>
									<p className='text-small-regular'>Extra driver x{watch.extra_drivers.length}</p>
									<p className='text-tiny'>
										{toCurrency(settings?.extra_driver_price_per_day)}
									</p>
									<p>
										{settings?.extra_driver_price_type === 'day'
											? toCurrency(settings?.extra_driver_price_per_day * num_days *watch.extra_drivers.length )
											: toCurrency(settings?.extra_driver_price_per_day *watch.extra_drivers.length)}
									</p>
								</div>
							)}
							{equip.map((extra) => (
								<div key={extra.item.id} className='flex justify-between'>
									<p className='text-small-regular'>{`${extra.item.name} (x${extra.count})`}</p>
									<p className='text-tiny'>{toCurrency(extra.item.price_per_day)}</p>
									<p>
										{extra.item.price_type === 'day'
											? toCurrency(extra.item.price_per_day * num_days *extra.count)
											: toCurrency(extra.item.price_per_day *extra.count)}
									</p>
								</div>
							))}
							<div className='flex justify-between'>
								<p className='text-small-regular'>{insurance?.name}</p>
								<p className='text-tiny'>
									{toCurrency(insurance?.price_per_day)}
								</p>
								<p>
									{insurance?.price_type === 'day'
										? toCurrency(insurance?.price_per_day * num_days)
										: toCurrency(insurance?.price_per_day)}
								</p>
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

						<div>
							<p className='text-heading4-medium'>Deposit</p>

							<div className='flex justify-between'>
								<p className='text-small-regular'>Security deposit</p>
								<p>{toCurrency(insurance?.deposit_amount)}</p>
							</div>
							<div className='flex justify-between'>
								<p className='text-small-regular'>Damage excess:</p>
								<p>{toCurrency(insurance?.deposit_excess)}</p>
							</div>
						</div>
					</div>
				)}
				<div className='flex justify-between'>
					<p className='text-base-semibold'>Due Balance</p>
					<p className=''>{toCurrency(vehicleTotal + extrasTotal + extra_drivers_total_price)}</p>
				</div>
			</div>
		</div>
	)
}
