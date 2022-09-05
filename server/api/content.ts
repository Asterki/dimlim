import express from "express";
import { getLang } from "../utils/locale";

const router: express.Router = express.Router();

router.get("/language", (req, res) => {
    let { lang, category, page } = req.query;

    // Check that values are there and that they're the right type
    if (!lang || !category || !page) return res.send({ status: 400, message: "missing-params" });
    if (typeof lang !== "string" || typeof page !== "string" || typeof category !== "string")
        return res.send({ status: 400, message: "invalid-params" });

    try {
        // Send the language pack
        const langFile = getLang(lang)[category][page];
        return res.send({ status: 200, content: langFile });
    } catch (err) {
        return res.send({ status: 500, message: "server-error" });
    }
});

module.exports = router;
