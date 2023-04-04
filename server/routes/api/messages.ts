import express from "express";
import { z } from "zod";
import UserModel from "../../models/user";

const router: express.Router = express.Router();

router.get("/get-chat-key", (req, res) => {
    res.send("remodelation")
})

module.exports = router;
