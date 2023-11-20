'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from '../dbConnect'
import orderModel from '@/models/order.model'
import vehicleModel from '@/models/vehicle.model'
import clientModel from '@/models/client.model'
import extraModel from '@/models/extra.model'
import groupModel from '@/models/group.model'
import { discardTime } from '../utils'

export async function fetchOrders(page, limit, searchOptions = {}) {
	try {
		await dbConnect()
		return await orderModel
			.find(searchOptions)
			.populate('vehicle')
			.populate('client')
			.populate('insurance')
			.populate({ path: 'extras.item', model: 'Extras' })
	} catch (error) {
		throw new Error('Failed to fetch orders: ' + error.message)
	}
}

export async function totalCountOrders() {
	try {
		await dbConnect()
		return await orderModel.countDocuments({})
	} catch (error) {
		console.log(error)
	}
}

export async function createOrder(values, path) {
	try {
		await dbConnect()
		await orderModel.create(values)
		revalidatePath(path)
		return true
	} catch (error) {
		console.log(error)
		return false
	}
}

export async function updateOrder(orderId, values, path) {
	try {
		await orderModel.findByIdAndUpdate(orderId, values)
		revalidatePath(path)
		return true
	} catch (error) {
		console.log(error)
		return false
	}
}

export async function fetchOrder(id) {
	try {
		await dbConnect()
		return await orderModel
			.findById(id)
			.populate({
				path: 'vehicle',
				model: 'Vehicle',
				populate: { path: 'group', model: 'Group' },
			})
			.populate('client')
			.populate('insurance')
			.populate({ path: 'extras.item', model: 'Extras' })
	} catch (error) {
		throw new Error('Failed to fetch order: ' + error.message)
	}
}

export async function fetchOrderForDate(date) {
	date = discardTime(date)
	let nextDate = new Date(date)
	nextDate.setDate(nextDate.getDate() + 1)

	console.log(nextDate);
	try {
		await dbConnect()
		return await orderModel.find({
			$or: [
				{ pick_up_date: { $gt: date, $lt: nextDate } },
				{ drop_off_date: { $gt: date, $lt: nextDate } },
			],
		})
		.populate({
			path: 'vehicle',
			model: 'Vehicle',
			populate: { path: 'group', model: 'Group' },
		})
		.populate('client')
		.populate('insurance')
		.populate({ path: 'extras.item', model: 'Extras' })
	} catch (error) {
		throw new Error(
			'Failed to fetch order for date: ' + date + 'error: ' + error.message
		)
	}
}

export async function deleteOrder(id, path) {
	try {
		await dbConnect()
		await orderModel.findByIdAndDelete(id)
		revalidatePath(path)
		return true
	} catch (error) {
		console.log(error)
		throw new Error('Could not delete order with id: ' + id)
	}
}
