'use server'

import { revalidatePath } from "next/cache";
import dbConnect, { dbDisconnect } from "../dbConnect";
import settingsModel from "@/models/settings.model";



export async function fetchSettings(userId) {
    try {

        await dbConnect()
        return await settingsModel.findOne({users: userId})
    } catch (error) {
        throw new Error('Failed to fetch Settings: ' + error.message)
    }
}

export async function updateSettings(userId, values, path) {

    try {
        await dbConnect()    
        await settingsModel.findOneAndUpdate({users: userId}, values)
        // revalidatePath(path);
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
        // revalidatePath(path);
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
