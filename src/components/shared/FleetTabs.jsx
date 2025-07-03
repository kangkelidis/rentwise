'use client'

import { Tabs, Tab } from '@nextui-org/tabs'
import { vehicleColumns } from '@/components/tables/columns'
import TableUI from '@/components/tables/table'
import FleetOverview from '@/components/shared/FleetOverview'

export default function FleetTabs({ vehicleData, fleetStats }) {
    return (
        <Tabs aria-label="Fleet options" fullWidth>
            <Tab key="list" title="Fleet List">
                <TableUI columns={vehicleColumns} data={vehicleData} />
            </Tab>
            <Tab key="analytics" title="Analytics">
                <FleetOverview fleetStats={fleetStats} />
            </Tab>
        </Tabs>
    )
}
