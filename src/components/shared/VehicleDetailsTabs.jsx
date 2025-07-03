'use client'

import { useState } from 'react'
import { Tabs, Tab } from '@nextui-org/tabs'
import { Spinner } from '@nextui-org/spinner'
import { VehicleForm } from '@/components/forms/VehicleForm'
import PriceChart from '@/components/shared/PriceChart'
import VehicleStats from '@/components/shared/VehicleStats'
import { orderColumns } from '@/components/tables/columns'
import TableUI from '@/components/tables/table'
import { DEFAULT_LIMIT } from '@/constants'
import { getVehicleStats } from '@/lib/actions/vehicle.analytics'

export default function VehicleDetailsTabs({ data, vehicleId }) {
    const [vehicleStats, setVehicleStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleTabChange = async (key) => {
        // If the analytics tab is selected and we haven't fetched the data yet
        if (key === 'analytics' && !vehicleStats) {
            setIsLoading(true);
            try {
                // Fetch the stats for the specific vehicle
                const stats = await getVehicleStats(vehicleId);
                setVehicleStats(stats);
            } catch (error) {
                console.error("Failed to load vehicle stats:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Tabs aria-label="Vehicle options" fullWidth onSelectionChange={handleTabChange}>
            <Tab key="edit" title="Edit Vehicle">
                {/* Pass the full data object, stringified, as the form expects */}
                <VehicleForm data={JSON.stringify(data)} />
            </Tab>

            <Tab key="analytics" title="Analytics">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner label="Loading analytics..." color="primary" />
                    </div>
                ) : (
                    // Pass the fetched stats to the component
                    <VehicleStats vehicleId={vehicleId} initialStats={vehicleStats} />
                )}
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
