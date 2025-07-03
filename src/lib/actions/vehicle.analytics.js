'use server'

import dbConnect from '../dbConnect'
import orderModel from '@/models/order.model'
import vehicleModel from '@/models/vehicle.model'

export async function getVehicleStats(vehicleId, year = null) {
  try {
    await dbConnect()

    const vehicle = await vehicleModel.findById(vehicleId)
    if (!vehicle) return null

    // Build date filter for completed orders (drop-off date in the past)
    const dateFilter = {
      drop_off_date: { $lt: new Date() } // Drop-off date is in the past
    }

    if (year) {
      // If filtering by year, check that pick-up or drop-off was in that year
      dateFilter.$or = [
        {
          pick_up_date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        },
        {
          drop_off_date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      ]
    }

    // Fetch completed orders for this vehicle
    const orders = await orderModel.find({
      vehicle: vehicleId,
      ...dateFilter
    })
    .populate('client')
    .sort({ pick_up_date: 1 })

    // Calculate basic stats
    const stats = {
      totalRevenue: 0,
      totalBookings: orders.length,
      totalDaysRented: 0,
      averageDailyRate: 0,
      utilizationRate: 0,
      revenueByMonth: {},
      averageBookingDuration: 0,
      topClients: {},
      priceHistory: []
    }

    // Process each order
    orders.forEach(order => {
      // Calculate revenue with proper fallbacks based on PDF logic
      const vehicleRevenue = order.prices?.vehicle?.custom ||
                            order.prices?.vehicle?.total ||
                            0

      const insuranceRevenue = order.prices?.insurance?.custom ||
                            order.prices?.insurance?.total ||
                            0

      const driversRevenue = order.prices?.drivers?.custom ||
                          order.prices?.drivers?.total ||
                          0

      // Calculate equipment revenue
      const equipmentRevenue = order.extras?.reduce((total, extra) => {
        const itemPrice = order.prices?.equipment?.[extra.item.name]?.custom ||
                         order.prices?.equipment?.[extra.item.name]?.total ||
                         0
        return total + itemPrice
      }, 0) || 0

      // Total revenue for this order (matches PDF calculation)
      const totalRevenue = vehicleRevenue + insuranceRevenue + driversRevenue + equipmentRevenue

      // Use the virtual num_days field
      const duration = order.num_days

      // Only process if we have valid data
      if (totalRevenue > 0 && duration > 0) {
        stats.totalRevenue += totalRevenue
        stats.totalDaysRented += duration

        // Monthly revenue breakdown
        const month = new Date(order.pick_up_date).toISOString().slice(0, 7)
        stats.revenueByMonth[month] = (stats.revenueByMonth[month] || 0) + totalRevenue

        // Top clients by revenue
        const clientName = order.client?.full_name || 'Unknown'
        stats.topClients[clientName] = (stats.topClients[clientName] || 0) + totalRevenue

        // Price history for trends
        stats.priceHistory.push({
          orderId: order._id.toString(),
          date: order.pick_up_date,
          dailyRate: totalRevenue / duration,
          totalRevenue: totalRevenue,
          duration: duration,
          breakdown: {
            vehicle: vehicleRevenue,
            insurance: insuranceRevenue,
            drivers: driversRevenue,
            equipment: equipmentRevenue
          }
        })
      }
    })

    // Calculate averages
    if (orders.length > 0) {
      stats.averageDailyRate = stats.totalDaysRented > 0 ? stats.totalRevenue / stats.totalDaysRented : 0
      stats.averageBookingDuration = stats.totalDaysRented / stats.totalBookings
    }

    // Calculate utilization rate (simplified)
    if (vehicle.createdAt) {
      const daysSinceCreation = Math.ceil(
        (new Date() - new Date(vehicle.createdAt)) / (1000 * 60 * 60 * 24)
      )
      stats.utilizationRate = daysSinceCreation > 0 ? (stats.totalDaysRented / daysSinceCreation) * 100 : 0
    }

    return stats
  } catch (error) {
    console.error('Error calculating vehicle stats:', error)
    return null
  }
}

export async function getFleetStats(vehicleIds = null, year = null) {
  try {
    await dbConnect()

    // Get all vehicles or specific ones
    const vehicles = vehicleIds
      ? await vehicleModel.find({ _id: { $in: vehicleIds } })
      : await vehicleModel.find({})

    const fleetStats = []

    for (const vehicle of vehicles) {
      const vehicleStats = await getVehicleStats(vehicle._id, year)
      if (vehicleStats) {
        fleetStats.push({
          vehicle: {
            id: vehicle._id.toString(),
            make: vehicle.make,
            model: vehicle.model,
            registration: vehicle.registration,
            group: vehicle.group
          },
          ...vehicleStats
        })
      }
    }

    // Sort by total revenue (highest first)
    return fleetStats.sort((a, b) => b.totalRevenue - a.totalRevenue)
  } catch (error) {
    console.error('Error calculating fleet stats:', error)
    return []
  }
}

export async function getVehicleGroupStats(groupId, year = null) {
  try {
    await dbConnect()

    const vehicles = await vehicleModel.find({ group: groupId })
    const vehicleIds = vehicles.map(v => v._id)

    return await getFleetStats(vehicleIds, year)
  } catch (error) {
    console.error('Error calculating group stats:', error)
    return []
  }
}
