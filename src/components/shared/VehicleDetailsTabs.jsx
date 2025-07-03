'use client'

import { Tabs, Tab } from '@nextui-org/tabs'
import { VehicleForm } from '@/components/forms/VehicleForm'
import PriceChart from '@/components/shared/PriceChart'
import VehicleStats from '@/components/shared/VehicleStats'
import { orderColumns } from '@/components/tables/columns'
import TableUI from '@/components/tables/table'
import { DEFAULT_LIMIT } from '@/constants'

export default function VehicleDetailsTabs({ data, vehicleId }) {
    return (
        <Tabs aria-label="Vehicle options" fullWidth>
            <Tab key="edit" title="Edit Vehicle">
                {/* Pass the full data object, stringified, as the form expects */}
                <VehicleForm data={JSON.stringify(data)} />
            </Tab>

            <Tab key="analytics" title="Analytics">
                <VehicleStats vehicleId={vehicleId} initialStats={data.vehicleStats} />
            </Tab>

            <Tab key="pricing" title="Pricing">
                <div className='card-container'>
                    <h2>Price Distribution</h2>
                    <PriceChart vehicle={JSON.stringify(data.vehicle)} />
                </div>
            </Tab>

            <Tab key="history" title="History">
                <div className='card-container'>
                    <h4>Booking History</h4>
                    <TableUI
                        columns={orderColumns}
                        rowsPerPage={DEFAULT_LIMIT / 2}
                        data={JSON.stringify(data.orders)}
                    />
                </div>
            </Tab>
        </Tabs>
    )
}
