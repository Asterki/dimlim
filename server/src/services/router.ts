import { RouteOptions, FastifyInstance } from "fastify";

// Account routes
import registerRoute from "../routes/accounts/register";
import loginRoute from "../routes/accounts/login";

// Routers
const accountRouter = [registerRoute, loginRoute] as unknown as [RouteOptions];

class Router {
    routes: {
        accounts: [RouteOptions];
    };

    constructor() {
        this.routes = {
            accounts: accountRouter,
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
