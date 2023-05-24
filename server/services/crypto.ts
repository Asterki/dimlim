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

export { updatePublicKey }