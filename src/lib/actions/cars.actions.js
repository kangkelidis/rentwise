'use server'

import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import Vehicle from "@/models/vehicle.model";

export async function getAllCars() {
    try {
        await dbConnect()
        const cars = await Vehicle.find({})
        return cars
    } catch (error) {
        console.log(err);
    }
}

export async function updateCar(carId, values, path) {
    console.log(carId, values, path);
    try {
        await dbConnect()
        const newCar = await Vehicle.findByIdAndUpdate(carId, values, { upsert: true })

        if (path.includes("/fleet/")) {
            revalidatePath(path);
          }

        return true;
      } catch (error) {
        console.log(error);
        return false
      }
}

export async function getCar(id) {
    try {
        await dbConnect()
        return await Vehicle.findById(id)
    } catch (error) {
        throw new Error('Failed to fetch car: ' + error.message)
    }
}

export async function deleteCar(id) {
    try {
        await dbConnect()
        await Vehicle.findByIdAndDelete({id})
    } catch (error) {
        console.log(error);
        throw new Error('Could not delete car with id: ' + id)
    }
}
