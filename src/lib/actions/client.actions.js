'use server'

import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import clientModel from "@/models/client.model";

export async function fetchClients() {
    try {
        await dbConnect()
        return await clientModel.find({})
    } catch (error) {
        throw new Error('Failed to fetch clients: ' + error.message)
    }
}

// Used as data for comboBox
export async function fetchClientsList() {
    const clients = await fetchClients()
    return clients.map(client => ({
        label: client.first_name + ' ' + client.last_name,
        value: client._id
    }))
}

export async function updateClient(clientID, values, path) {
    try {
        await dbConnect()        
        
        const client = clientID ? await clientModel.findByIdAndUpdate(clientID, values)
        :
        await clientModel.create(values)
    
        revalidatePath(path);
        return true;
      } catch (error) {
        console.log(error);
        return false
      }
}

export async function fetchClient(id) {
    try {
        await dbConnect()
        return await clientModel.findById(id)
    } catch (error) {
        throw new Error('Failed to fetch client: ' + error.message)
    }
}

export async function deleteClient(id, path) {
    try {
        await dbConnect()
        await clientModel.findByIdAndDelete(id)
        revalidatePath(path)
        return true
    } catch (error) {
        console.log(error);
        throw new Error('Could not delete client with id: ' + id)
    }
}
