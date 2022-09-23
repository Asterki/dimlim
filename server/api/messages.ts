import express from "express";

import { User } from "../types";
import db from "../config/databases";
import { io } from "..";

const router: express.Router = express.Router();

router.post("/get-key", async (req: any, res: any) => {
    if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });
    if (!req.body.contact || !req.body.user) return res.send({ status: 400, message: "missing-parameters" });
    if (typeof req.body.contact !== "string" || typeof req.body.user !== "string") return res.send({ status: 400, message: "invalid-parameters" });

    try {
        const users = await db.get("users");
        const user: User | undefined = users.find((listUser: any) => listUser.username == req.body.user);
        const userToFind: User | undefined = users.find((listUser: any) => listUser.username == req.body.contact);

        if (!userToFind || !user) return res.send({ status: 400, message: "user-not-found" });

        res.send({ status: 200, message: [userToFind.encSecret, user.encSecret].sort().join("") });
    } catch (err) {
        const errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

router.post("/get-pending-messages", async (req: any, res: any) => {
    if (!req.isAuthenticated()) return res.send({ status: 403, message: "unauthorized" });

    try {
        const messages = await db.get(`${req.body.chatName}_pending`);
        if (!messages) return res.send({ status: 200, content: [] });

        await db.set(`${req.body.chatName}_pending`, []);
        return res.send({ status: 200, content: messages });
    } catch (err) {
        const errorID = reportError(err);
        return res.send({ status: 500, message: "server-error", id: errorID });
    }
});

router.post("/create-group", (req, res) => {
    res.send("water");
});

router.post("/test", (req, res) => {
    io.sockets.to(`notification listener ${req.body.userID}`).emit("notification", { content: "a" });
    res.send("water");
});

module.exports = router;
