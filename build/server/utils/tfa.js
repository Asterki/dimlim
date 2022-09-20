"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTFA = void 0;
const speakeasy_1 = __importDefault(require("speakeasy"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const databases_1 = __importDefault(require("../config/databases"));
const checkTFA = (code, user, users) => {
    const verified = speakeasy_1.default.totp.verify({
        secret: user.tfa.secret,
        encoding: "base32",
        token: code,
    });
    if (verified == false) {
        // Check if a backup code was submitted instead
        let backupCodeVerified = false;
        user.tfa.backupCodes.forEach((listCode, index) => __awaiter(void 0, void 0, void 0, function* () {
            if (listCode !== "0") {
                if (bcrypt_1.default.compareSync(code, listCode)) {
                    backupCodeVerified = true;
                    // Update the user
                    const newUserList = users.filter((listUser) => listUser.userID !== user.userID);
                    user.tfa.backupCodes[index] = "0";
                    // Push to database
                    newUserList.push(user);
                    yield databases_1.default.put("users", newUserList);
                }
            }
        }));
        // If both failed, return invalid
        if (backupCodeVerified == false)
            return "invalid-tfa-code";
        else
            return "success";
    }
    else
        return "success";
};
exports.checkTFA = checkTFA;
