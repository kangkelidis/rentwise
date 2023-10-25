'use server'

import { revalidatePath } from "next/cache";
import dbConnect from "../dbConnect";
import groupModel from "@/models/group.model";

// TODO: total groups needed?
export async function fetchGroups() {
    try {
        await dbConnect()
        return await groupModel.find({})
    } catch (error) {
        throw new Error('Failed to fetch Groups: ' + error.message)
    }
}

export async function updateGroup(groupID, values, path) {
    try {
        await dbConnect()        
        
        const group = groupID ? await groupModel.findByIdAndUpdate(groupID, values)
        :
        await groupModel.create(values)
    
        revalidatePath(path);
        return true;
      } catch (error) {
        console.log(error);
        return false
      }
}

export async function deleteGroup(id, path) {
    try {
        await dbConnect()
        await groupModel.findByIdAndDelete(id)
        revalidatePath(path)
        return true
    } catch (error) {
        console.log(error);
        throw new Error('Could not delete group with id: ' + id)
    }
}
