import express, { Router as ExpressRouter, Express, NextFunction } from "express";

// Account routes
import registerRoute from "../routes/accounts/register";
import loginRoute from "../routes/accounts/login";
import meRoute from "../routes/accounts/me";

class Router {
    private instance: Router | null = null;
    public accountRouter: ExpressRouter = express.Router();

    constructor() {}

    getInstance() {
        if (!this.instance) this.instance = new Router();
        return this.instance;
    }

    public registerRoutes = (server: Express) => {
        // Account routes
        this.accountRouter.post("/register", registerRoute);
        this.accountRouter.post("/login", loginRoute);
        this.accountRouter.get("/me", meRoute);

        server.use("/api/accounts", this.accountRouter);
    };
}

export default Router;
