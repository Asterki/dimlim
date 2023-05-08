import fs from 'fs/promises'
import path from 'path'

import { v4 as uuidv4 } from "uuid";
import { mkdirp } from "mkdirp"

import UserModel from "../models/user";

import { Document } from "mongoose";
import { User } from "../../shared/types/models";

const uploadAvatar = async (userID: string, image: string) => {
    const user: (User & Document) | null = await UserModel.findOne({ userID: userID });
    if (!user) return;

    // Create the user folder if it doesn't exist yet
    const directory: string = process.env.NODE_ENV == "development" ? `../../data/avatars/${user.userID}` : `../../../data/avatars/${user.userID}`
    mkdirp(path.join(__dirname, directory))

    // Delete the old avatar
    if (user.avatar !== "") {
        await fs.unlink(path.join(__dirname, `${directory}/${user.avatar}.jpeg`))
    }

    // Update the user avatar
    const avatarID = uuidv4()
    user.avatar = avatarID

    // Save the avatar
    await fs.writeFile(path.join(__dirname, `${directory}/${avatarID}.jpeg`), image, 'base64');
    user.save()

    return true
}

export { uploadAvatar };
