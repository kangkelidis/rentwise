'use client'

import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Select, SelectItem } from '@nextui-org/select'
import { toCurrency } from '@/lib/utils'
import { useState } from 'react'
import { useRouter } from 'next/navigation' // Import the router
import MonthlyRevenueChart from '@/components/shared/MonthlyRevenueChart'

export default function VehicleStats({ vehicleId, initialStats }) {
  const router = useRouter() // Initialize the router
  const [stats, setStats] = useState(initialStats)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [loading, setLoading] = useState(false)

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No analytics data available for this vehicle</p>
      </div>
    )
  }

  // Generate years array
  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i
    return { key: year.toString(), label: year.toString() }
  })

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Vehicle Analytics</h3>

        {/* <Select
          selectedKeys={new Set([selectedYear])}
          onSelectionChange={(keys) => setSelectedYear(Array.from(keys)[0])}
          className="w-32"
          size="sm"
        >
          {years.map(year => (
            <SelectItem key={year.key}>
              {year.label}
            </SelectItem>
          ))}
        </Select> */}

      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <h4 className="text-sm font-medium text-gray-400">Total Revenue</h4>
          </CardHeader>
          <CardBody className="pt-0">
            <p className="text-2xl font-bold">{toCurrency(stats.totalRevenue || 0)}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h4 className="text-sm font-medium text-gray-400">Total Bookings</h4>
          </CardHeader>
          <CardBody className="pt-0">
            <p className="text-2xl font-bold">{stats.totalBookings || 0}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h4 className="text-sm font-medium text-gray-400">Days Rented</h4>
          </CardHeader>
          <CardBody className="pt-0">
            <p className="text-2xl font-bold">{stats.totalDaysRented || 0}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h4 className="text-sm font-medium text-gray-400">Avg Daily Rate</h4>
          </CardHeader>
          <CardBody className="pt-0">
            <p className="text-2xl font-bold">{toCurrency(stats.averageDailyRate || 0)}</p>
          </CardBody>
        </Card>
      </div>

      {/* Utilization Card */}
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold">Utilization Details</h4>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{(stats.utilizationRate || 0).toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Utilization Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{(stats.averageBookingDuration || 0).toFixed(1)}</p>
              <p className="text-sm text-gray-500">Avg Booking Duration (days)</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {toCurrency((stats.totalRevenue || 0) / (stats.totalDaysRented || 1))}
              </p>
              <p className="text-sm text-gray-500">Revenue per Day</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {toCurrency((stats.totalRevenue || 0) / (stats.totalBookings || 1))}
              </p>
              <p className="text-sm text-gray-500">Revenue per Booking</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Monthly Revenue and Top Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h4 className="text-lg font-semibold">Monthly Revenue & Avg. Rate</h4>
          </CardHeader>
          <CardBody>
            <MonthlyRevenueChart
              revenueData={stats.revenueByMonth}
              priceHistoryData={stats.priceHistory}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h4 className="text-lg font-semibold">Top Clients</h4>
          </CardHeader>
          <CardBody>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(stats.topClients || {})
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([client, revenue]) => (
                  <div key={client} className="flex justify-between items-center">
                    <span className="text-sm truncate flex-1 mr-2">{client}</span>
                    <span className="font-semibold">{toCurrency(revenue)}</span>
                  </div>
                ))}
              {Object.keys(stats.topClients || {}).length === 0 && (
                <p className="text-gray-500 text-center py-4">No client data available</p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Price History */}
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold">Recent Bookings</h4>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left p-2">Date</th>
                  <th className="text-right p-2">Duration</th>
                  <th className="text-right p-2">Daily Rate</th>
                  <th className="text-right p-2">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {(stats.priceHistory || [])
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 10)
                  .map((booking) => (
                    <tr
                      key={booking.orderId} // Use the unique orderId for the key
                      className="border-b border-gray-700 hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => router.push(`/orders/${booking.orderId}`)}
                    >
                      <td className="p-2 text-sm">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="text-right p-2">{booking.duration} days</td>
                      <td className="text-right p-2">{toCurrency(booking.dailyRate)}</td>
                      <td className="text-right p-2">{toCurrency(booking.totalRevenue)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {(!stats.priceHistory || stats.priceHistory.length === 0) && (
              <div className="text-center py-4 text-gray-500">No booking history available</div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Debug section
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold">Debug Info</h4>
        </CardHeader>
        <CardBody>
          <pre className="text-xs overflow-auto max-h-32">
            {JSON.stringify(stats, null, 2)}
          </pre>
        </CardBody>
      </Card> */}
    </div>
  )
}
