'use server'

import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import orderModel from "@/models/order.model"
import vehicleModel from "@/models/vehicle.model";

export async function fetchOrders() {
    try {
        await dbConnect()
        return await orderModel.find({}).populate('vehicle_id')
    } catch (error) {
        throw new Error('Failed to fetch orders: ' + error.message)
    }
}

export async function updateOrder(orderID, values, path) {
    try {
        await dbConnect()
        const vehicle = await vehicleModel.findById(values.vehicle_id)
        
        
        const order = orderID ? await orderModel.findByIdAndUpdate(orderID, values)
        :
        await orderModel.create(values)
        
        vehicle.orders.push(order)
        await vehicle.save()

        revalidatePath(path);
        return true;
      } catch (error) {
        console.log(error);
        return false
      }
}

export async function fetchOrder(id) {
    try {
        await dbConnect()
        return await orderModel.findById(id)
    } catch (error) {
        throw new Error('Failed to fetch order: ' + error.message)
    }
}

export async function deleteOrder(id, path) {
    try {
        await dbConnect()
        await orderModel.findByIdAndDelete(id)
        revalidatePath(path)
        return true
    } catch (error) {
        console.log(error);
        throw new Error('Could not delete order with id: ' + id)
    }
}
