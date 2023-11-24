import { VehicleForm } from '@/components/forms/VehicleForm'
import PriceChart from '@/components/shared/PriceChart'
import { orderColumns } from '@/components/tables/columns'
import TableUI from '@/components/tables/table'
import { DEFAULT_LIMIT } from '@/constants'
import { fetchInsurances } from '@/lib/actions/extras.actions'
import { fetchGroups } from '@/lib/actions/group.actions'
import { fetchOrders } from '@/lib/actions/order.actions'
import { fetchOwners } from '@/lib/actions/owner.actions'
import { fetchVehicle } from '@/lib/actions/vehicle.actions'

export default async function Page({ params, searchParams }) {
	const page = searchParams.page || 1
	const limit = searchParams.limit || DEFAULT_LIMIT / 2
	const sortColumn = searchParams.sortColumn || 'number'
	const sortDirection = searchParams.sortDirection || 'descending'

	const groups = fetchGroups()
	const owners = fetchOwners()
	const vehicle = fetchVehicle(params.id)
	const insurances = fetchInsurances()
	const orders = fetchOrders(page, limit, sortColumn, sortDirection, {
		vehicle: params.id,
	})

	const result = await Promise.all([
		groups,
		owners,
		vehicle,
		insurances,
		orders,
	])
	const data = {
		groups: result[0],
		owners: result[1],
		vehicle: JSON.parse(result[2]),
		insurances: result[3],
		orders: result[4],
	}
	return (
		<div className='flex flex-col gap-4'>
			<h2 className='head-text'>Edit</h2>
			<div>
				<VehicleForm data={JSON.stringify(data)} />
			</div>

			<div className='card-container'>
				<h2>Price Distribution</h2>
				<PriceChart vehicle={JSON.stringify(data.vehicle)} />
			</div>

			<div className='card-container'>
				<h4>History</h4>
				<TableUI columns={orderColumns} rowsPerPage={DEFAULT_LIMIT/2} data={JSON.stringify(data.orders)} />
			</div>
		</div>
	)
}
