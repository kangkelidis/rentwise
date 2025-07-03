'use client'

import { Card, CardBody, CardHeader } from '@nextui-org/card'
import VehicleDetails from '@/components/elements/vehicle-details'
import { toCurrency } from '@/lib/utils'

export default function FleetOverview({ fleetStats }) {
  if (!fleetStats || fleetStats.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No fleet data available</p>
      </div>
    )
  }

  const totalRevenue = fleetStats.reduce((sum, vehicle) => sum + (vehicle.totalRevenue || 0), 0)
  const totalBookings = fleetStats.reduce((sum, vehicle) => sum + (vehicle.totalBookings || 0), 0)
  const avgUtilization = fleetStats.length > 0
    ? fleetStats.reduce((sum, vehicle) => sum + (vehicle.utilizationRate || 0), 0) / fleetStats.length
    : 0

  return (
    <div className="space-y-6">
      {/* Fleet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <h4 className="text-sm font-medium text-gray-400">Total Fleet Revenue</h4>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">{toCurrency(totalRevenue)}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="text-sm font-medium text-gray-400">Total Bookings</h4>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">{totalBookings}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="text-sm font-medium text-gray-400">Avg Utilization</h4>
          </CardHeader>
          <CardBody>
            <p className="text-2xl font-bold">{avgUtilization.toFixed(1)}%</p>
          </CardBody>
        </Card>
      </div>

      {/* Vehicle Performance Table */}
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold">Vehicle Performance</h4>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-2">Vehicle</th>
                  <th className="text-right p-2">Revenue</th>
                  <th className="text-right p-2">Bookings</th>
                  <th className="text-right p-2">Days Rented</th>
                  <th className="text-right p-2">Utilization</th>
                  <th className="text-right p-2">Avg Daily Rate</th>
                </tr>
              </thead>
              <tbody>
                {fleetStats.map((vehicle, index) => (
                  <tr key={vehicle.vehicle.id} className="border-b border-gray-700">
                    <td className="p-2">
                      <VehicleDetails vehicle={vehicle.vehicle} size={2} />
                    </td>
                    <td className="text-right p-2">{toCurrency(vehicle.totalRevenue || 0)}</td>
                    <td className="text-right p-2">{vehicle.totalBookings || 0}</td>
                    <td className="text-right p-2">{vehicle.totalDaysRented || 0}</td>
                    <td className="text-right p-2">{(vehicle.utilizationRate || 0).toFixed(1)}%</td>
                    <td className="text-right p-2">{toCurrency(vehicle.averageDailyRate || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Debug: Raw Data */}
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold">Debug Data</h4>
        </CardHeader>
        <CardBody>
          <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(fleetStats, null, 2)}
          </pre>
        </CardBody>
      </Card>
    </div>
  )
}
