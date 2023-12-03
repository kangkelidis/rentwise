'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from '../dbConnect'
import orderModel from '@/models/order.model'
import vehicleModel from '@/models/vehicle.model'
import clientModel from '@/models/client.model'
import extraModel from '@/models/extra.model'
import groupModel from '@/models/group.model'
import { discardTime } from '../utils'
import * as CSV from 'csv-string'

export async function fetchOrders(page, limit, sortColumn, sortDirection, searchOptions = {}) {
	try {
		await dbConnect()
		const orders =  await orderModel
		.find(searchOptions)
		.populate('vehicle')
		.populate('client')
		.populate('insurance')
		.populate({ path: 'extras.item', model: 'Extras' })
		.sort({[sortColumn]: sortDirection})
		.limit(limit)
		.skip((page - 1) * limit)

		const count = await orderModel.countDocuments(searchOptions)
		
		return {items: orders, count: count}
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
		const order = await orderModel.create(values)
		revalidatePath(path)
		return order.id
	} catch (error) {
		console.log(error)
		return false
	}
}

export async function updateOrder(orderId, values, path) {
	try {
		await orderModel.findByIdAndUpdate(orderId, values)
		revalidatePath(path)
		return orderId
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

	if (date.toString() === 'Invalid Date') {
		return
	}
	
	date = discardTime(date)
	let nextDate = new Date(date)
	nextDate.setDate(nextDate.getDate() + 1)

	try {
		await dbConnect()
		const orders = await orderModel
			.find({
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

		return orders.map((order) => {
			const type =
				order.pick_up_date >= date && order.pick_up_date <= nextDate
					? 'pick_up'
					: 'drop_off'

			return { data: order, type: type }
		})
	} catch (error) {
		throw new Error(
			'Failed to fetch order for date: ' + date + 'error: ' + error.message
		)
	}
}

export async function fetchMissedOrders() {
	const now = new Date()
	const orders = await orderModel.find({
		$or: [
		{$and: [{pick_up_date: {$lt: now}}, {status: 'reserved'}]},
		{$and: [{drop_off_date: {$lt: now}}, {status: {$ne: 'done'}}]},
	]})
	.populate({
		path: 'vehicle',
		model: 'Vehicle',
		populate: { path: 'group', model: 'Group' },
	})
	.populate('client')
	.populate('insurance')
	.populate({ path: 'extras.item', model: 'Extras' })

	return orders.map((order) => {
		const type =
			order.pick_up_date < now 
				? 'pick_up'
				: 'drop_off'

		return { data: order, type: type }
	})
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

export async function createMany(data) {
	try {
		await dbConnect()
		await orderModel.insertMany(data, {ordered: false})
	} catch (error) {
		console.log(error)
		throw new Error('Could not create orders ')
	}
}

export async function createFromCSV(data) {
	const parsedData = CSV.parse(data, { output: 'objects' }).filter(
		(d) => d['Id']
	)

	const formattedData = await Promise.all(
		parsedData.map(async (data) => {
			return {
				vehicle: await vehicleModel.findOne({
					registration: data['Vehicle Number'].replace(' ', '').toUpperCase(),
				}).select('id'),
				client: await clientModel.findOne({
					full_name: data['Customer']
				}).select('id'),
				pick_up_date: new Date(data['Pickup']),
				drop_off_date: new Date(data['Return']),
				status: 'done',
				prices: {
					vehicle: {
						total: Number(data['Amount Total'].replace(' €', '')),
						custom: Number(data['Amount Total'].replace(' €', '')),
					},
					insurance: {
						custom: Number(data['Insurance Price'].replace(' €', '')),
					},
					deposit: {
						custom: Number(data['Security Deposit'].replace(' €', '')),
					},
					excess: {
						custom: Number(data['Security Deposit'].replace(' €', '')),
					},
				},
			}
		})
	)

	const filterData = formattedData.filter(d => d.vehicle && d.client)

	await createMany(filterData)
}
