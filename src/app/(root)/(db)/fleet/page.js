import { Button } from '@nextui-org/button'
import Link from 'next/link'
import { DEFAULT_LIMIT } from '@/constants'
import UploadCSVFile from '@/components/shared/UploadCSVFile'
import { fetchVehicles, totalCountVehicles, createFromCSV } from '@/lib/actions/vehicle.actions'
import { getFleetStats } from '@/lib/actions/vehicle.analytics'
import FleetTabs from '@/components/shared/FleetTabs' // Import the new component

export default async function Page({ searchParams } ) {
    const page = searchParams.page || 1
    const limit = searchParams.limit || DEFAULT_LIMIT
    const sortColumn = searchParams.sortColumn || 'number'
    const sortDirection = searchParams.sortDirection || 'descending'

    // Fetch both vehicle list and fleet stats in parallel
    const [vehicleResult, statsResult] = await Promise.all([
        fetchVehicles(page, limit, sortColumn, sortDirection),
        getFleetStats()
    ]);

    const vehicleCount = await totalCountVehicles();

    // Sanitize data for the client components
    const vehicleData = JSON.stringify({ items: vehicleResult, count: vehicleCount });
    const fleetStats = JSON.parse(JSON.stringify(statsResult));

    return (
        <div className=''>
            <div className='flex place-content-between mb-3 items-baseline'>
                <h2 className='head-text'>Fleet</h2>
                <Button color='secondary' className='mb-4'>
                    <Link href={'/fleet/create'}>Add Vehicle</Link>
                </Button>
            </div>

            {/* Use the new tabs component */}
            <FleetTabs vehicleData={vehicleData} fleetStats={fleetStats} />

            <UploadCSVFile action={createFromCSV}/>
        </div>
    )
}
