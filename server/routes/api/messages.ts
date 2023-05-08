// Message related routes
// * In progress

import express from "express";

const router: express.Router = express.Router();

router.get("/get-chat-key", (req, res) => {
    res.send("remodelation")
})

module.exports = router;
