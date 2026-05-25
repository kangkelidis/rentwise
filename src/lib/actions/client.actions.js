'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from '../dbConnect'
import clientModel from '@/models/client.model'
import orderModel from '@/models/order.model'
import * as CSV from 'csv-string'
import { getClientDisplayName } from '@/lib/client-display'

function cleanOptionalString(value) {
	if (typeof value !== 'string') return value

	const trimmed = value.trim()
	return trimmed || undefined
}

function cleanClientValues(values = {}) {
	return {
		...values,
		full_name: cleanOptionalString(values.full_name),
		tel: cleanOptionalString(values.tel),
		email: cleanOptionalString(values.email)?.toLowerCase(),
		passport: cleanOptionalString(values.passport),
		license: cleanOptionalString(values.license),
		nationality: cleanOptionalString(values.nationality),
		address: cleanOptionalString(values.address),
		dob: values.dob || undefined,
		documents: Array.isArray(values.documents) ? values.documents : [],
	}
}

function getDuplicateClientQuery(values) {
	const checks = []

	if (values.email) checks.push({ email: values.email })
	if (values.license) checks.push({ license: values.license })
	if (values.passport) checks.push({ passport: values.passport })
	if (values.full_name && values.tel) {
		checks.push({ full_name: values.full_name, tel: values.tel })
	}

	return checks.length ? { $or: checks } : null
}

export async function fetchClients(
	page,
	limit,
	sortColumn,
	sortDirection,
	searchOptions = {}
) {
	try {
		await dbConnect()
		const clients = await clientModel
			.find(searchOptions)
			.sort({ [sortColumn]: sortDirection })
			.limit(limit)
			.skip((page - 1) * limit)

		const count = await clientModel.countDocuments(searchOptions)

		return { items: clients, count: count }
	} catch (error) {
		console.warn('Failed to fetch clients:', error.message)
		return { items: [], count: 0 }
	}
}

export async function totalCountClients() {
	try {
		await dbConnect()
		return await clientModel.countDocuments({})
	} catch (error) {
		console.log(error)
	}
}

// Used as data for comboBox
export async function fetchClientsList() {
	const clients = await fetchClients()
	if (!clients || !clients.items) return []
	return clients.items.map((client) => ({
		label: getClientDisplayName(client, 'Unnamed client'),
		value: client._id,
	}))
}

export async function updateClient(clientID, values, path) {
	try {
		await dbConnect()
		const cleanValues = cleanClientValues(values)

		if (clientID) {
			await clientModel.findByIdAndUpdate(clientID, cleanValues)
		} else {
			const duplicateQuery = getDuplicateClientQuery(cleanValues)
			const existingClient = duplicateQuery
				? await clientModel.findOne(duplicateQuery)
				: null

			if (!existingClient) {
				await clientModel.create(cleanValues)
			}
		}

		revalidatePath(path)
		return true
	} catch (error) {
		console.log(error)
		return false
	}
}

export async function fetchClient(id) {
	try {
		await dbConnect()
		return await clientModel.findById(id)
	} catch (error) {
		console.warn('Failed to fetch client:', error.message)
		return null
	}
}

export async function deleteClient(id, path) {
	try {
		await dbConnect()
		const orderCount = await orderModel.countDocuments({ client: id })

		if (orderCount > 0) {
			throw new Error(
				'Cannot delete a client with existing orders. Reassign or delete the orders first.'
			)
		}

		await clientModel.findByIdAndDelete(id)
		revalidatePath(path)
		return true
	} catch (error) {
		console.log(error)
		throw new Error(error?.message || 'Could not delete client with id: ' + id)
	}
}

export async function createMany(data) {
	try {
		await dbConnect()
		await clientModel.insertMany(data)
	} catch (error) {
		console.log(error)
		throw new Error('Could not create clients ')
	}
}

export async function createFromCSV(data) {
	data = data.replace('Birthday', 'dob')
	data = data.replace('Phone Number', 'tel')
	data = data.replace('Email', 'email')
	data = data.replace('Driver License Number', 'license')

	const clientsData = CSV.parse(data, { output: 'objects' })

	const cleanClientsData = clientsData.map((data) => {
		return {
			full_name: data['First Name'] + ' ' + data['Last Name'],
			dob: data.dob,
			address:
				data.Building +
				', ' +
				data.Street +
				', ' +
				data.Region +
				', ' +
				data.City +
				', ' +
				data['Zip Code'] +
				'',
			tel: data.tel,
			email: data.email,
			license: data.license,
		}
	})

	await createMany(cleanClientsData)
}
