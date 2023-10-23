'use server'

import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import vehicleModel from "@/models/vehicle.model";
import orderModel from "@/models/order.model";
import ownerModel from "@/models/owner.model";

export async function fetchVehicles(page, limit ) {
    try {
        await dbConnect()
        return await vehicleModel.find({}).limit(limit).skip((page-1) * limit).populate('owner')
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

// Used as data for comboBox
export async function fetchVehiclesList(availableFrom, availableTill) { 
    const vehicles = availableFrom && availableTill ?
    await fetchAvailableVehicles(availableFrom, availableTill)
    :
    await fetchVehicles()
	
    return vehicles.map((vehicle) => ({
		label: `${vehicle.make} ${vehicle.model}, ${vehicle.registration}`,
		value: vehicle._id,
	}))
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

export async function getVehicle(id) {
    try {
        await dbConnect()
        return await vehicleModel.findById(id)
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
