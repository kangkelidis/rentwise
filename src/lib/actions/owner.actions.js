'use server'

import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import ownerModel from "@/models/owner.model";

export async function fetchOwners() {
    try {
        await dbConnect()
        return await ownerModel.find({})
    } catch (error) {
        throw new Error('Failed to fetch owners: ' + error.message)
    }
}

// Used as data for comboBox
export async function fetchOwnersList() {
    const owners = await fetchOwners()
    return owners.map(owner => ({
        label: owner.name,
        value: owner._id
    }))
}

export async function updateOwner(ownerID, values, path) {
    try {
        await dbConnect()        
        
        const owner = ownerID ? await ownerModel.findByIdAndUpdate(ownerID, values)
        :
        await ownerModel.create(values)
        revalidatePath(path);
        return true;
      } catch (error) {
        console.log(error);
        return false
      }
}

export async function fetchOwner(id) {
    try {
        await dbConnect()
        return await ownerModel.findById(id)
    } catch (error) {
        throw new Error('Failed to fetch owner: ' + error.message)
    }
}

export async function deleteOwner(id, path) {
    try {
        await dbConnect()
        await ownerModel.findByIdAndDelete(id)
        revalidatePath(path)
        return true
    } catch (error) {
        console.log(error);
        throw new Error('Could not delete owner with id: ' + id)
    }
}
