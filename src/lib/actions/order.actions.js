'use server'

import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import Order from "@/models/order.model"

export async function fetchOrders() {
    try {
        await dbConnect()
        return await Order.find({})
    } catch (error) {
        throw new Error('Failed to fetch orders: ' + error.message)
    }
}

export async function updateOrder(orderID, values, path) {
    try {
        await dbConnect()
        orderID ? await Order.findByIdAndUpdate(orderID, values)
        :
        await Order.create(values)
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
        return await Order.findById(id)
    } catch (error) {
        throw new Error('Failed to fetch order: ' + error.message)
    }
}

export async function deleteOrder(id, path) {
    try {
        await dbConnect()
        await Order.findByIdAndDelete(id)
        revalidatePath(path)
        return true
    } catch (error) {
        console.log(error);
        throw new Error('Could not delete order with id: ' + id)
    }
}
