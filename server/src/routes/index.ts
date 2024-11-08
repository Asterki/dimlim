import type { Express } from 'express';

// Import the routers
import AccountsRouter from './accounts';
import ContactsRouter from './contacts';
import CryptoRouter from './crypto';
import ProfileRouter from './profile';
import SettingsRouter from './settings';
import UsersRouter from './users';
import UtilsRouter from './utils';

class Router {
  private instance: Router | null = null;

  constructor() {}

  getInstance() {
    if (!this.instance) this.instance = new Router();
    return this.instance;
  }

  public registerRoutes = (server: Express) => {
    server.use('/api/accounts', AccountsRouter);
    server.use('/api/contacts', ContactsRouter);
    server.use('/api/crypto', CryptoRouter);
    server.use('/api/profile', ProfileRouter);
    server.use('/api/settings', SettingsRouter);
    server.use('/api/users', UsersRouter);
    server.use('/api/profile', UtilsRouter);
  };
}

export default Router;
