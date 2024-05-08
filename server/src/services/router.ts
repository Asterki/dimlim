import express, { Express, Router as ExpressRouter } from 'express';

// Account routes
import accountsRegister from '../routes/accounts/register';
import accountsLogin from '../routes/accounts/login';
import accountsMe from '../routes/accounts/me';
import accountsLogout from '../routes/accounts/logout';

// Contact routes
import contactsAdd from '../routes/contacts/add';
import contactsRemove from '../routes/contacts/remove';
import contactsBlock from '../routes/contacts/block';
import contactsUnblock from '../routes/contacts/unblock';
import contactsPending from '../routes/contacts/pending';
import contactsGet from '../routes/contacts/get';

// Settings routes
import settingsGeneral from '../routes/settings/general';
import settingsPrivacy from '../routes/settings/privacy';
import settingsNotification from '../routes/settings/notifications';
import settingsChangePassword from '../routes/settings/security/changepassword';
import settingsTfa from '../routes/settings/security/tfa';

// Utils routes
import generateTFA from '../routes/utils/generate-tfa';
import verifyTFA from '../routes/utils/verify-tfa';

// Profile routes
import profileUpdate from '../routes/profile/update';
import profilePicture from '../routes/profile/picture';

class Router {
  public accountRouter: ExpressRouter = express.Router();
  public contactsRouter: ExpressRouter = express.Router();
  public settingsRouter: ExpressRouter = express.Router();
  public utilsRouter: ExpressRouter = express.Router();
  public profileRouter: ExpressRouter = express.Router();
  private instance: Router | null = null;

  constructor() {}

  getInstance() {
    if (!this.instance) this.instance = new Router();
    return this.instance;
  }

  public registerRoutes = (server: Express) => {
    // Account routes
    this.accountRouter.post('/register', accountsRegister);
    this.accountRouter.post('/login', accountsLogin);
    this.accountRouter.get('/me', accountsMe);
    this.accountRouter.get('/logout', accountsLogout);

    // Contact routes
    this.contactsRouter.post('/add', contactsAdd);
    this.contactsRouter.post('/remove', contactsRemove);
    this.contactsRouter.post('/block', contactsBlock);
    this.contactsRouter.post('/unblock', contactsUnblock);
    this.contactsRouter.post('/pending', contactsPending);
    this.contactsRouter.get('/get', contactsGet);

    // Settings routes
    this.settingsRouter.post('/general', settingsGeneral);
    this.settingsRouter.post('/privacy', settingsPrivacy);
    this.settingsRouter.post('/notifications', settingsNotification);
    this.settingsRouter.post('/security/change-password', settingsChangePassword);
    this.settingsRouter.post('/security/tfa', settingsTfa);

    // Utils routesw
    this.utilsRouter.post('/verify-tfa', verifyTFA);
    this.utilsRouter.get('/generate-tfa', generateTFA);

    // Profile routes
    this.profileRouter.post('/update', profileUpdate);
    this.profileRouter.post('/picture', profilePicture);

    server.use('/api/accounts', this.accountRouter);
    server.use('/api/contacts', this.contactsRouter);
    server.use('/api/settings', this.settingsRouter);
    server.use('/api/utils', this.utilsRouter);
    server.use('/api/profile', this.profileRouter);
  };
}

export default Router;
