'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from '../dbConnect'
import ownerModel from '@/models/owner.model'

export async function fetchOwners(
	page,
	limit,
	sortColumn,
	sortDirection,
	searchOptions = {}
) {
	try {
		await dbConnect()
		return await ownerModel
			.find({})
			.sort({ [sortColumn]: sortDirection })
			.limit(limit)
			.skip((page - 1) * limit)
	} catch (error) {
		console.warn('Failed to fetch owners:', error.message)
		return []
	}
}

export async function totalCountOwners() {
	try {
		await dbConnect()
		return await ownerModel.countDocuments({})
	} catch (error) {
		console.log(error)
	}
}

export async function updateOwner(ownerID, values, path) {

	try {
		await dbConnect()
		const owner = ownerID
			? await ownerModel.findByIdAndUpdate(ownerID, values)
			: await ownerModel.create(values)
		revalidatePath(path)
		return true
	} catch (error) {
		console.log(error)
		return false
	}
}

export async function fetchOwner(id) {
	try {
		await dbConnect()
		return await ownerModel.findById(id)
	} catch (error) {
		console.warn('Failed to fetch owner:', error.message)
		return null
	}
}

export async function deleteOwner(id, path) {
	try {
		await dbConnect()
		await ownerModel.findByIdAndDelete(id)
		revalidatePath(path)
		return true
	} catch (error) {
		console.log(error)
		throw new Error('Could not delete owner with id: ' + id)
	}
}
