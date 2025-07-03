'use client'

import { useState, useMemo } from 'react'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import VehicleDetails from '@/components/elements/vehicle-details'
import { toCurrency } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function FleetOverview({ fleetStats }) {
  const router = useRouter()
  const [sortConfig, setSortConfig] = useState({ key: 'totalRevenue', direction: 'descending' });

  const sortedFleetStats = useMemo(() => {
    if (!fleetStats) return [];
    let sortableItems = [...fleetStats];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const getSortValue = (item, key) => {
          if (key === 'vehicle') {
            // Sort by make, then model
            const make = item.vehicle.make || '';
            const model = item.vehicle.model || '';
            return `${make.toLowerCase()} ${model.toLowerCase()}`;
          }
          return item[key] || 0;
        };

        const aValue = getSortValue(a, sortConfig.key);
        const bValue = getSortValue(b, sortConfig.key);

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [fleetStats, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

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

  const SortableHeader = ({ sortKey, children, align = 'right' }) => (
    <th className={`p-2 cursor-pointer hover:text-primary transition-colors text-${align}`} onClick={() => requestSort(sortKey)}>
      {children}
      <span className="text-primary">{getSortIndicator(sortKey)}</span>
    </th>
  );

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
                  <SortableHeader sortKey="vehicle" align="left">Vehicle</SortableHeader>
                  <SortableHeader sortKey="totalRevenue">Revenue</SortableHeader>
                  <SortableHeader sortKey="totalBookings">Bookings</SortableHeader>
                  <SortableHeader sortKey="totalDaysRented">Days Rented</SortableHeader>
                  <SortableHeader sortKey="utilizationRate">Utilization</SortableHeader>
                  <SortableHeader sortKey="averageDailyRate">Avg Daily Rate</SortableHeader>
                </tr>
              </thead>
              <tbody>
                {sortedFleetStats.map((vehicle) => (
                  <tr
                    key={vehicle.vehicle.id}
                    className="border-b border-gray-700 hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => router.push(`/fleet/${vehicle.vehicle.id}`)}
                  >
                    <td className="p-2">
                      {/* Use the new prop to show the registration text */}
                      <VehicleDetails
                        vehicle={vehicle.vehicle}
                        size={2}
                        showRegistrationText
                      />
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
    </div>
  )
}
