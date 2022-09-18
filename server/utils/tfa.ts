import speakeasy from "speakeasy";
import bcrypt from "bcrypt";

import db from "../config/databases";
import { User } from "../types";

const checkTFA = (code: string, user: User, users: Array<User>) => {
    const verified = speakeasy.totp.verify({
        secret: user.tfa.secret,
        encoding: "base32",
        token: code,
    });

    if (verified == false) {
        // Check if a backup code was submitted instead
        let backupCodeVerified = false;

        user.tfa.backupCodes.forEach(async (listCode: string, index: number) => {
            if (listCode !== "0") {
                if (bcrypt.compareSync(code, listCode)) {
                    backupCodeVerified = true;

                    // Update the user
                    const newUserList = users.filter((listUser: User) => listUser.userID !== user.userID);
                    user.tfa.backupCodes[index] = "0";

                    // Push to database
                    newUserList.push(user);
                    await db.put("users", newUserList);
                }
            }
        });

        // If both failed, return invalid
        if (backupCodeVerified == false) return "invalid-tfa-code";
        else return "success";
    } else return "success";
};

export { checkTFA };
