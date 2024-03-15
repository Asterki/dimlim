import { RouteOptions } from "fastify";

import accountRouter from "../routes/account";

class Router {
    routes: {
        accounts: [RouteOptions];
    };

    constructor() {
        this.routes = {
            accounts: accountRouter as [RouteOptions],
        };
    }

    public getAllRoutes = (): RouteOptions[] => {
        return [...this.routes.accounts];
    };

    public registerRoutes = (routes: RouteOptions[]) => {
        for (const route of routes) {
            this.routes.accounts.push(route);
        }
    }
}

export default Router;
