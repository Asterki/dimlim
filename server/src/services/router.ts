import { RouteOptions, FastifyInstance } from "fastify";

// Account routes
import registerRoute from "../routes/accounts/register";
import loginRoute from "../routes/accounts/login";
import meRoute from "../routes/accounts/me";

// Routers
const accountRouter = [registerRoute, loginRoute, meRoute] as unknown as [RouteOptions];

class Router {
    private instance: Router | null = null;
    routes: {
        accounts: [RouteOptions];
    };

    constructor() {
        this.routes = {
            accounts: accountRouter,
        };
    }

    getInstance() {
        if (!this.instance) this.instance = new Router();
        return this.instance;
    }

    public getAllRoutes = (): RouteOptions[] => {
        return [...this.routes.accounts];
    };

    public registerRoutes = (server: FastifyInstance) => {
        for (const route of this.getAllRoutes()) {
            server.route(route);
        }
    };
}

export default Router;
