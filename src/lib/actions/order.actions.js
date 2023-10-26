'use server'

import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import orderModel from "@/models/order.model"
import vehicleModel from "@/models/vehicle.model";
import clientModel from "@/models/client.model";

export async function fetchOrders() {
    try {
        await dbConnect()
        return await orderModel.find({}).populate('vehicle').populate('client')
    } catch (error) {
        throw new Error('Failed to fetch orders: ' + error.message)
    }
}

export async function totalCountOrders() {
    try {
        await dbConnect()
        return await orderModel.countDocuments({})
    } catch (error) {
        console.log(error);
    }
}


export async function createOrder(values, path) {

    try {
        await dbConnect()
        await orderModel.create(values)
        revalidatePath(path);
        return true;
      } catch (error) {
        console.log(error);
        return false
      }
}

export async function updateOrder(orderId, values, path) {
    try {
        await orderModel.findByIdAndUpdate(orderId, values)
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
        return await orderModel.findById(id).populate('vehicle').populate('client')
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
