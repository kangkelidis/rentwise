'use server'

import { revalidatePath } from "next/cache";
import { auth } from '@clerk/nextjs'
import dbConnect from "../dbConnect";
import settingsModel from "@/models/settings.model";



export async function fetchSettings(userId) {
    try {

        await dbConnect()
        return await settingsModel.findOne({ users: userId })
    } catch (error) {
        console.warn('Failed to fetch settings:', error.message)
        return null
    }
}

export async function updateSettings(userId, values, path) {
    try {
        const { userId: currentUserId } = auth()
        const resolvedUserId = userId || currentUserId
        if (!resolvedUserId) return false

        await dbConnect()
        await settingsModel.findOneAndUpdate(
            { users: resolvedUserId },
            { ...values, users: resolvedUserId },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )
        if (typeof path === 'string' && path.length > 0) {
            revalidatePath(path)
        }
        return true;
    } catch (error) {
        console.log(error);
        return false
    }
}

export async function createSettings(userId, values, path) {
    try {
        let newSettings = {
            ...values,
            users: userId
        }
        await dbConnect()
        await settingsModel.create(newSettings)
        if (typeof path === 'string' && path.length > 0) {
            revalidatePath(path)
        }
        return true;
    } catch (error) {
        console.log(error);
        return false
    }
}

export async function deleteSettings(id, path) {
    try {
        await dbConnect()
        await settingsModel.findByIdAndDelete(id)
        revalidatePath(path)
        return true
    } catch (error) {
        console.log(error);
        throw new Error('Could not delete settings with id: ' + id)
    }
}
