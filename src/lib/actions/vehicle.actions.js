'use server'

import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import Vehicle from "@/models/vehicle.model";
import vehicleModel from "@/models/vehicle.model";
import orderModel from "@/models/order.model";

export async function fetchVehicles( page, limit ) {
    try {
        await dbConnect()
        return await Vehicle.find({}).limit(limit).skip((page-1) * limit)
    } catch (error) {
        console.log(err);
    }
}

export async function totalCountVehicles() {
    try {
        await dbConnect()
        return await Vehicle.countDocuments({})
    } catch (error) {
        console.log(err);
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
    console.log(values);

    try {
        await dbConnect()
        vehicleId ? await Vehicle.findByIdAndUpdate(vehicleId, values)
        :
        await Vehicle.create(values)
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
        return await Vehicle.findById(id)
    } catch (error) {
        throw new Error('Failed to fetch vehicle: ' + error.message)
    }
}

export async function deleteVehicle(id, path) {
    try {
        await dbConnect()
        await Vehicle.findByIdAndDelete(id)
        revalidatePath(path)
        return true
    } catch (error) {
        console.log(error);
        throw new Error('Could not delete vehicle with id: ' + id)
    }
}
