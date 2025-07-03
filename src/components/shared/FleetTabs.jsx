'use client'

import { useState } from 'react'
import { Tabs, Tab } from '@nextui-org/tabs'
import { Spinner } from '@nextui-org/spinner'
import { vehicleColumns } from '@/components/tables/columns'
import TableUI from '@/components/tables/table'
import FleetOverview from '@/components/shared/FleetOverview'
import { getFleetStats } from '@/lib/actions/vehicle.analytics' // Import the server action

export default function FleetTabs({ vehicleData }) {
    const [fleetStats, setFleetStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleTabChange = async (key) => {
        // If the analytics tab is selected and we haven't fetched the data yet
        if (key === 'analytics' && !fleetStats) {
            setIsLoading(true);
            try {
                const stats = await getFleetStats();
                setFleetStats(stats);
            } catch (error) {
                console.error("Failed to load fleet stats:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Tabs aria-label="Fleet options" fullWidth onSelectionChange={handleTabChange}>
            <Tab key="list" title="Fleet List">
                <TableUI columns={vehicleColumns} data={vehicleData} />
            </Tab>
            <Tab key="analytics" title="Analytics">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner label="Loading analytics..." color="primary" />
                    </div>
                ) : (
                    <FleetOverview fleetStats={fleetStats} />
                )}
            </Tab>
        </Tabs>
    )
}
