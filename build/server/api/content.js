"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const locale_1 = require("../utils/locale");
const error_1 = require("../utils/error");
const router = express_1.default.Router();
router.post("/language", (req, res) => {
    const { lang, category, page } = req.body;
    if (!lang || !category || !page)
        // Check that values are there and that they're the right type
        return res.send({ status: 400, message: "missing-params" });
    if (typeof lang !== "string" || typeof page !== "string" || typeof category !== "string")
        return res.send({ status: 400, message: "invalid-params" });
    try {
        // Send the language pack
        const langFile = (0, locale_1.getLanguagePack)(lang)[category][page];
        return res.send({ status: 200, content: langFile });
    }
    catch (err) {
        const errorID = (0, error_1.reportError)(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});
module.exports = router;
