import express from "express";
import { getLanguagePack } from "../utils/locale";
import { reportError } from "../utils/error";

const router: express.Router = express.Router();

router.post("/language", (req: any, res) => {
    let { lang, category, page } = req.body;

    if (!lang || !category || !page)
        // Check that values are there and that they're the right type
        return res.send({ status: 400, message: "missing-params" });
    if (typeof lang !== "string" || typeof page !== "string" || typeof category !== "string") return res.send({ status: 400, message: "invalid-params" });

    try {
        // Send the language pack
        const langFile = getLanguagePack(lang)[category][page];
        return res.send({ status: 200, content: langFile });
    } catch (err) {
        let errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

module.exports = router;
