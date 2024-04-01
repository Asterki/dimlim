import express, { Router as ExpressRouter, Express, NextFunction } from "express";

// Account routes
import accountsRegister from "../routes/accounts/register";
import accountsLogin from "../routes/accounts/login";
import accountsMe from "../routes/accounts/me";

// Contact routes
import contactsAdd from "../routes/contacts/add";
// import contactsAdd from "../routes/contacts/remove";
// import contactsAdd from "../routes/contacts/get";
// import contactsAdd from "../routes/contacts/block";

class Router {
    private instance: Router | null = null;
    public accountRouter: ExpressRouter = express.Router();
    public contactsRouter: ExpressRouter = express.Router();

    constructor() {}

    getInstance() {
        if (!this.instance) this.instance = new Router();
        return this.instance;
    }

    public registerRoutes = (server: Express) => {
        // Account routes
        this.accountRouter.post("/register", accountsRegister);
        this.accountRouter.post("/login", accountsLogin);
        this.accountRouter.get("/me", accountsMe);

        // Contact routes
        this.contactsRouter.post("/add", contactsAdd);

        server.use("/api/accounts", this.accountRouter);
        server.use("/api/contacts", this.contactsRouter);
    };
}

export default Router;
