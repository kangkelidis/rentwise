'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from '../dbConnect'
import clientModel from '@/models/client.model'
import * as CSV from 'csv-string'

export async function fetchClients(
	page,
	limit,
	sortColumn,
	sortDirection,
	searchOptions = {}
) {
	try {
		await dbConnect()
		return await clientModel
			.find({})
			.sort({ [sortColumn]: sortDirection })
			.limit(limit)
			.skip((page - 1) * limit)
	} catch (error) {
		throw new Error('Failed to fetch clients: ' + error.message)
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
	return clients.map((client) => ({
		label: client.full_name,
		value: client._id,
	}))
}

export async function updateClient(clientID, values, path) {
	try {
		await dbConnect()

		const client = clientID
			? await clientModel.findByIdAndUpdate(clientID, values)
			: await clientModel.create(values)

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
		throw new Error('Failed to fetch client: ' + error.message)
	}
}

export async function deleteClient(id, path) {
	try {
		await dbConnect()
		await clientModel.findByIdAndDelete(id)
		revalidatePath(path)
		return true
	} catch (error) {
		console.log(error)
		throw new Error('Could not delete client with id: ' + id)
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
