'use server'

import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import vehicleModel from "@/models/vehicle.model";
import orderModel from "@/models/order.model";
import ownerModel from "@/models/owner.model";
import groupModel from "@/models/group.model";

export async function fetchVehicles(page, limit ) {
    try {
        await dbConnect()
        return await vehicleModel.find({}).limit(limit).skip((page-1) * limit).populate('owner').populate('group')
    } catch (error) {
        console.log(error);
    }
}

export async function fetchVehiclesInGroup(groupId) {
    try {
        await dbConnect()
        return await vehicleModel.find({group: groupId})
    } catch (error) {
        console.log(error);
    }
}

export async function totalCountVehicles() {
    try {
        await dbConnect()
        return await vehicleModel.countDocuments({})
    } catch (error) {
        console.log(error);
    }
}

export async function fetchAvailableVehicles(fromDate, tillDate) {
    const allVehicles = await vehicleModel.find({})
    const boolArray = await Promise.all(allVehicles.map(v => v.isAvailableDuring(fromDate, tillDate)));
    const availableVehicles = allVehicles.filter((_, index) => boolArray[index])
    return availableVehicles
}

export async function updateVehicle(vehicleId, values, path) {
    try {
        await dbConnect()
        vehicleId ? await vehicleModel.findByIdAndUpdate(vehicleId, values)
        :
        await vehicleModel.create(values)
        revalidatePath(path);
        return true;
      } catch (error) {
        console.log(error);
        return false
      }
}

export async function fetchVehicle(id) {
    try {
        await dbConnect()
        return JSON.stringify(await vehicleModel.findById(id))
    } catch (error) {
        throw new Error('Failed to fetch vehicle: ' + error.message)
    }
}

export async function deleteVehicle(id, path) {
    try {
        await dbConnect()
        await vehicleModel.findByIdAndDelete(id)
        revalidatePath(path)
        return true
    } catch (error) {
        console.log(error);
        throw new Error('Could not delete vehicle with id: ' + id)
    }
}
