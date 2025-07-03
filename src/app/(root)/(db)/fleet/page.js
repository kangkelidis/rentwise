import { Button } from '@nextui-org/button'
import Link from 'next/link'
import { DEFAULT_LIMIT } from '@/constants'
import UploadCSVFile from '@/components/shared/UploadCSVFile'
import { fetchVehicles, totalCountVehicles, createFromCSV } from '@/lib/actions/vehicle.actions'
import FleetTabs from '@/components/shared/FleetTabs'

export default async function Page({ searchParams } ) {
    const page = searchParams.page || 1
    const limit = searchParams.limit || DEFAULT_LIMIT
    const sortColumn = searchParams.sortColumn || 'number'
    const sortDirection = searchParams.sortDirection || 'descending'

    // Only fetch the data needed for the initial view (the vehicle list)
    const vehicleResult = await fetchVehicles(page, limit, sortColumn, sortDirection);
    const vehicleCount = await totalCountVehicles();

    // Sanitize data for the client component
    const vehicleData = JSON.stringify({ items: vehicleResult, count: vehicleCount });

    return (
        <div className=''>
            <div className='flex place-content-between mb-3 items-baseline'>
                <h2 className='head-text'>Fleet</h2>
                <Button color='secondary' className='mb-4'>
                    <Link href={'/fleet/create'}>Add Vehicle</Link>
                </Button>
            </div>

            {/* Pass only the vehicle data. The tabs component will fetch its own stats. */}
            <FleetTabs vehicleData={vehicleData} />

            <UploadCSVFile action={createFromCSV}/>
        </div>
    )
}
