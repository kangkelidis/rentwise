import { fetchInsurances } from '@/lib/actions/extras.actions'
import { fetchGroups } from '@/lib/actions/group.actions'
import { fetchOrders } from '@/lib/actions/order.actions'
import { fetchOwners } from '@/lib/actions/owner.actions'
import { fetchVehicle } from '@/lib/actions/vehicle.actions'
import { getVehicleStats } from '@/lib/actions/vehicle.analytics'
import { DEFAULT_LIMIT } from '@/constants'
import VehicleDetailsTabs from '@/components/shared/VehicleDetailsTabs'

export default async function Page({ params, searchParams }) {
    const page = searchParams.page || 1
    const limit = searchParams.limit || DEFAULT_LIMIT / 2
    const sortColumn = searchParams.sortColumn || 'number'
    const sortDirection = searchParams.sortDirection || 'descending'

    // Fetch all data in parallel
    const [groups, owners, vehicle, insurances, orders, vehicleStats] = await Promise.all([
        fetchGroups(),
        fetchOwners(),
        fetchVehicle(params.id),
        fetchInsurances(),
        fetchOrders(page, limit, sortColumn, sortDirection, { vehicle: params.id }),
        getVehicleStats(params.id)
    ])

    const data = {
        groups: JSON.parse(JSON.stringify(groups)),
        owners: JSON.parse(JSON.stringify(owners)),
        vehicle: JSON.parse(vehicle),
        insurances: JSON.parse(JSON.stringify(insurances)),
        orders: JSON.parse(JSON.stringify(orders)),
        vehicleStats
    }

    return (
        <div className='flex flex-col gap-4'>
            <h2 className='head-text'>Vehicle Details</h2>

            <VehicleDetailsTabs data={data} vehicleId={params.id} />
        </div>
    )
}
