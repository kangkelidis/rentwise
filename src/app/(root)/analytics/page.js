import { getFleetStats } from '@/lib/actions/vehicle.analytics'
import FleetOverview from '@/components/shared/FleetOverview'

export default async function Analytics() {
  const fleetStats = await getFleetStats()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Fleet Analytics</h1>
      <FleetOverview fleetStats={fleetStats} />
    </div>
  )
}
