import { Button } from '@nextui-org/button'
import { vehicleColumns } from '@/components/tables/columns'
import {
	fetchAvailableVehicles,
	fetchVehicles,
	totalCountVehicles,
	createFromCSV
} from '@/lib/actions/vehicle.actions'
import Link from 'next/link'
import TableUI from '@/components/tables/table'
import { DEFAULT_LIMIT } from '@/constants'
import UploadCSVFile from '@/components/shared/UploadCSVFile'

async function getData(page, limit) {
	const result = await fetchVehicles(page, limit)
	const vehicles = { items: result, count: await totalCountVehicles() }
	return JSON.stringify(vehicles)
}

export default async function Page({ searchParams }) {
	const page = searchParams.page || 1
	const limit = searchParams.limit || DEFAULT_LIMIT
	const data = await getData(page, limit)

	const from = new Date('2023-10-09T21:00:00.000+00:00')
	const till = new Date('2023-10-15T21:00:00.000+00:00')
	await fetchAvailableVehicles(from, till)

	return (
		<div className=''>
			<div className='flex place-content-between mb-3 items-baseline'>
				<h2 className='head-text'>Fleet</h2>
				<Button color='secondary' className='mb-4'>
					<Link href={'/fleet/create'}>Add Vehicle</Link>
				</Button>
			</div>
				<TableUI columns={vehicleColumns} data={data} />
				
			<UploadCSVFile action={createFromCSV}/>
		</div>
	)
}
