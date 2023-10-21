import {Button} from '@nextui-org/button'
import { vehicleColumns } from '@/components/tables/columns'
import {
	fetchAvailableVehicles,
	fetchVehicles,
  totalCountVehicles
} from '@/lib/actions/vehicle.actions'
import Link from 'next/link'
import TableUI from '@/components/tables/table'

async function getData(page, limit) {
	const vehicles = await fetchVehicles(page, limit)
	return vehicles.map((vehicle) => ({
		id: vehicle.id,
    	number: vehicle.number,
		make: vehicle.make,
		model: vehicle.model,
		year: vehicle.year,
		registration: vehicle.registration,
	}))
}

export default async function Page({params, searchParams}) {
  
  const page = searchParams.page || 1
  const limit = searchParams.limit || 10

	const data = await getData(page, limit)
  const count = await totalCountVehicles()


	const from = new Date('2023-10-09T21:00:00.000+00:00')
	const till = new Date('2023-10-15T21:00:00.000+00:00')
	await fetchAvailableVehicles(from, till)

	return (
		<div className='container mx-auto py-10'>
			<h2 className='head-text'>Fleet</h2> 
			<Button color='secondary'>
				<Link href={'/fleet/create'}>Add Vehicle</Link>
			</Button>
			<TableUI columns={vehicleColumns} data={data} count={count} />
		</div>
	)
}
