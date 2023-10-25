'use server'

import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import extraModel from "@/models/extra.model";

// TODO: total equip and total insurances
export async function fetchEquipment() {
    try {
        await dbConnect()
        return await extraModel.find({category: 'equipment'})
    } catch (error) {
        throw new Error('Failed to fetch Equipment: ' + error.message)
    }
}

export async function fetchInsurances() {
    try {
        await dbConnect()
        return await extraModel.find({category: 'insurance'})
    } catch (error) {
        throw new Error('Failed to fetch Insurance: ' + error.message)
    }
}


export async function updateExtra(extraID, values, path) {
    try {
        await dbConnect()        
        const extra = extraID ? await extraModel.findByIdAndUpdate(extraID, values)
        :
        await extraModel.create(values)
        revalidatePath(path);
        return true;
      } catch (error) {
        console.log(error);
        return false
      }
}

export async function deleteExtra(id, path) {
    try {
        await dbConnect()
        await extraModel.findByIdAndDelete(id)
        revalidatePath(path)
        return true
    } catch (error) {
        console.log(error);
        throw new Error('Could not delete extra with id: ' + id)
    }
}
