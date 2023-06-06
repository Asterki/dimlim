import UserModel from "../models/user";

import type { User } from "../../shared/types/models";
import { Document } from "mongoose";

const updatePublicKey = async (userID: string, pubKey: any) => {
    const user: (User & Document) | null = await UserModel.findOne({ userID: userID })
    if (user == null) return

    user.pubKey = pubKey
    user.save()
    return true
}

const getUserPublicKey = async (contactID: string, userID: string): Promise<string | boolean> => {
    const contact: (User & Document) | null = await UserModel.findOne({ userID: contactID })
    const user: (User & Document) | null = await UserModel.findOne({ userID: userID })
    
    if (contact == null || user == null) return false;

    const isUserInContacts = contact.contacts.find((contact) => {
        if (user.userID == contact.userID) return true;
    });
    if (!isUserInContacts) return false;

    return Buffer.from(new Uint8Array(contact.pubKey).buffer).toString("base64")
}

export { updatePublicKey, getUserPublicKey }