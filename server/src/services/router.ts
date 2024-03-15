import { RouteOptions, FastifyInstance } from "fastify";

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

    public registerRoutes = (server: FastifyInstance) => {
        for (const route of this.getAllRoutes()) {
            server.route(route);
        }
    }
}

export default Router;
