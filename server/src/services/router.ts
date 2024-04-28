import express, { Router as ExpressRouter, Express, NextFunction } from "express";

// Account routes
import accountsRegister from "../routes/accounts/register";
import accountsLogin from "../routes/accounts/login";
import accountsMe from "../routes/accounts/me";
import generateTFA from "../routes/accounts/generate-tfa";

// Contact routes
import contactsAdd from "../routes/contacts/add";
import contactsRemove from "../routes/contacts/remove";
import contactsBlock from "../routes/contacts/block";
import contactsUnblock from "../routes/contacts/unblock";
import contactsPending from "../routes/contacts/pending";
import contactsGet from "../routes/contacts/get";

// Settings routes
import generalSettings from "../routes/settings/general";
import securitySettings from "../routes/settings/security";
import privacySettings from "../routes/settings/privacy";
import notificationSettings from "../routes/settings/notifications";

class Router {
    private instance: Router | null = null;
    public accountRouter: ExpressRouter = express.Router();
    public contactsRouter: ExpressRouter = express.Router();
    public settingsRouter: ExpressRouter = express.Router();

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
        this.accountRouter.get("/generate-tfa", generateTFA);

        // Contact routes
        this.contactsRouter.post("/add", contactsAdd);
        this.contactsRouter.post("/remove", contactsRemove);
        this.contactsRouter.post("/block", contactsBlock);
        this.contactsRouter.post("/unblock", contactsUnblock);
        this.contactsRouter.post("/pending", contactsPending);
        this.contactsRouter.get("/get", contactsGet);

        // Settings routes
        this.settingsRouter.post("/general", generalSettings);
        this.settingsRouter.post("/security", securitySettings);
        this.settingsRouter.post("/privacy", privacySettings);
        this.settingsRouter.post("/notifications", notificationSettings);

        server.use("/api/accounts", this.accountRouter);
        server.use("/api/contacts", this.contactsRouter);
        server.use("/api/settings", this.settingsRouter);
    };
}

export default Router;
