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
const express_1 = __importDefault(require("express"));
const ms_1 = __importDefault(require("ms"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const upload_1 = require("../config/upload");
const error_1 = require("../utils/error");
const databases_1 = __importDefault(require("../config/databases"));
const router = express_1.default.Router();
router.post("/avatar", (0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)("1 hour"),
    max: 5,
    message: "rate-limit-exceeded",
}), (req, res) => {
    try {
        if (!req.user)
            return res.send({ status: 403, message: "not-logged-in" });
        upload_1.avatarUpload.single("avatar")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                if (err.message == "invalid-type")
                    return res.send({ status: 400, message: "invalid-file-type" });
                throw err;
            }
            const users = yield databases_1.default.get("users");
            const user = users.find((user) => user.userID == req.user.userID);
            if (!user)
                return res.send({ status: 400, message: "user-not-found" });
            // Replace the user
            const newUserList = users.filter((listUser) => listUser.userID !== (user === null || user === void 0 ? void 0 : user.userID));
            user.avatar = `${req.user.userID}.png`;
            newUserList.push(user);
            yield databases_1.default.set("users", newUserList);
            return res.redirect("/settings");
        }));
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});
module.exports = router;
