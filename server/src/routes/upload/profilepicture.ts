import validator from "validator";
import { z } from "zod";
import formidable, { IncomingForm } from "formidable";
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import fs from "fs-extra";

import UserModel from "../../models/users";

import {
    RegisterRequestBody as RequestBody,
    RegisterResponseData as ResponseData,
} from "../../../../shared/types/api/accounts";

import UploadService from "../../services/upload";

import { NextFunction, Request, Response } from "express";
import { User } from "../../../../shared/types/models";

// Profile picture upload
const handler = async (req: Request, res: Response, next: NextFunction) => {
    if (req.isUnauthenticated() || !req.user) return res.status(401).send({ status: "unauthenticated" });
    const currentUser = req.user as User;

    // Read the file
    const data: { files: formidable.Files; fields: formidable.Fields } = await new Promise((resolve, reject) => {
        const form = new IncomingForm();
        form.parse(req, (err, fields, files) => {
            // TODO: Add filter to only allow images
            if (err) return reject(err);

            resolve({ fields, files });
        });
    });

    if (!data.files.profile) return res.status(400).json({ message: "bad-request" });
    let file = data.files.profile[0];

    // Create the directory if it doesn't exist
    await UploadService.getInstance().createDirectory(
        path.join(__dirname, "/public/data/profile-pictures/", currentUser.userID)
    );

    let imgID = uuidv4();

    // Save the image
    let newPath =
        path.join(process.cwd(), "/public/data/profile-pictures/", currentUser!.userID) + "/" + imgID + "." + "png";
    let rawData = fs.readFileSync(file.filepath);

    // Compress the file
    await sharp(rawData)
        .resize(256, 256)
        .png()
        .toBuffer()
        .then((data) => {
            rawData = data;
        });

    fs.writeFile(newPath, rawData, function (err) {
        if (err) console.log(err);
    });

    // Delete the old user profile picture
    const userProfile = await UserModel.findOne({
        userID: currentUser.userID,
    });
    if (userProfile && userProfile.profile!.imageID) {
        fs.unlinkSync(
            path.join(
                process.cwd(),
                "/public/data/profile-pictures/",
                currentUser.userID,
                "/" + currentUser.profile.imageID + ".png"
            )
        );
    }

    // Update the user's profile picture
    await UserModel.updateOne(
        { userID: currentUser.userID },
        {
            $set: {
                "profile.imageID": imgID,
            },
        }
    );

    return res.status(200).send({
        status: "success",
    });
};

export default handler;
