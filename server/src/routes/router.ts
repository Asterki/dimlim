import { RouteOptions } from "fastify";

import accountRouter from "./account";

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
}

export default Router;
