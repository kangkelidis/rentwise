'use server'

import dbConnect from "../dbConnect";
import Vehicle from "@/models/vehicle.model";

export async function getAllCars() {
    await dbConnect()
    try {
        const cars = await Vehicle.find({})
        return cars
    } catch (error) {
        console.log(err);
    }
}

export async function createNewCar(values) {
    await dbConnect()

    try {
        const newCar = await Vehicle.create(values)
        return true;
      } catch (error) {
        console.log(error);
        return false
      }
}