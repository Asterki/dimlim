import { Express } from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import session from 'express-session';
import Logger from 'file-error-logging/dist/cjs';

import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import MongoStore from 'connect-mongo';

import UserModel from '../models/Users';

import { User } from '../../../shared/types/models';

class SessionManager {
  authStrategies: { [key: string]: passportLocal.Strategy };
  private instance: SessionManager | null = null;

  constructor() {
    this.authStrategies = {
      local: new passportLocal.Strategy(
        {
          usernameField: 'emailOrUsername',
          passwordField: 'password',
          passReqToCallback: true,
          session: false,
        },
        async (req: any, _email: string, _password: string, done) => {
          try {
            const user: (User & Document) | null = await UserModel.findOne({
              $or: [
                { 'email.value': req.body.emailOrUsername.toLowerCase() },
                { 'profile.username': req.body.emailOrUsername.toLowerCase() },
              ],
            });
            if (!user) return done(null, false, { message: 'invalid-credentials' });

            // Verify password and TFA code
            if (!bcrypt.compareSync(req.body.password, user.preferences.security.password))
              return done(null, false, { message: 'invalid-credentials' });

            if (user.preferences.security.twoFactor.active) {
              if (!req.body.tfaCode) return done(null, false, { message: 'requires-tfa' });

              const verified = speakeasy.totp.verify({
                secret: user.preferences.security.twoFactor.secret as string,
                encoding: 'base32',
                token: req.body.tfaCode,
              });

              if (verified == false) return done(null, false, { message: 'invalid-tfa-code' });
            }

            return done(null, user);
          } catch (err: unknown) {
            Logger.log('error', (err as Error).message);
            return done(err);
          }
        },
      ),
    };
    this.loadStrategies();
  }

  public getInstance() {
    if (!this.instance) this.instance = new SessionManager();
    return this.instance;
  }

  public loadToServer(server: Express) {
    server.use(
      session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          maxAge: 1000 * 60 * 60 * 24 * 7,
          sameSite: 'lax',
          httpOnly: false,
          path: '/',
          domain: 'localhost',
        },
        store: MongoStore.create({
          mongoUrl: process.env.MONGODB_URI as string,
          collectionName: 'sessions',
          dbName: 'dimlim',
        }),
      }),
    );
    server.use(passport.initialize());
    server.use(passport.session());
  }

  private loadStrategies() {
    passport.serializeUser((user: any, done) => {
      done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
      let user = await UserModel.findById(id);
      done(null, user);
    });

    passport.use(this.authStrategies.local);
  }
}

export default SessionManager;
