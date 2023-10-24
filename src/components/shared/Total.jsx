'use client'

import { fetchVehicle } from '@/lib/actions/vehicle.actions'
// TODO use server action
import { getPrice } from '@/lib/price/rates'
import { dateDiffInDays, toCurrency } from '@/lib/utils'
import {Divider} from "@nextui-org/divider";

export default function Total({ watch, vehicles, setPricePerDay }) {
	console.log(watch)
	const num_days = dateDiffInDays(watch.pick_up_date, watch.drop_off_date)
	const vehicle = vehicles.find((a) => a._id === watch.vehicle_id)

	const total = getPrice(
		vehicle?.basic_day_rate,
		watch.pick_up_date,
		watch.drop_off_date
	)

    setPricePerDay(total / num_days)
    
	return (
		<div className='max-lg:hidden'>
			<div className=' bg-primary-500 p-3 w-full rounded-t-lg'>
				<h2 className=' text-heading3-bold'>Summary</h2>
			</div>
			<div className='flex flex-col p-4 gap-2 bg-zinc-900 rounded-b-lg rounded-t-none'>
				<span className=' w-full flex justify-between'>
					<p>Rental period</p> <p className=' font-bold'>{num_days} days</p>
				</span>
				{vehicle && (
					<div className='bg-slate-700 -mx-4 p-4 flex gap-3 flex-col'>
						<p className='text-heading4-medium'>{vehicle.group.group}</p>
						<span className=' w-full flex justify-between gap-3'>
							<p>{vehicle.make + ' ' + vehicle.model}</p>
							<p className='text-body-semibold'>{toCurrency(total)}</p>
						</span>
						<span className=' w-full flex justify-between'>
							<p className='text-subtle-medium'>Tariff</p>
							<p className=' text-small-regular'>
								{toCurrency(total / num_days)} / day
							</p>
						</span>
                        <span className=' w-full flex justify-between'>
							<p className='text-subtle-medium'>VAT inc.</p>
							<p className=' text-small-regular'>
								{toCurrency(total * 19/100)}							</p>
						</span>
                        <Divider className="my-1" />

					</div>
				)}
			</div>
		</div>
	)
}
