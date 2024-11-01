import UserModel from '../models/Users';
import { HydratedDocument } from 'mongoose';

import Logger from '../utils/logger';
import { fetchUserByID, fetchUserByUsername } from '../utils/users';

import { User } from '../../../shared/types/models';

class SettingsService {
  private static instance: SettingsService;

  private constructor() {}

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  public async updateSettings(userID: string, data: Partial<User>): Promise<string> {
    try {
      const user = await fetchUserByID(userID);
      if (!user) return 'user-not-found';

      user.set(data);
      await user.save();

      return 'success';
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return 'error';
    }
  }

  public async fetchSettings(username: string): Promise<HydratedDocument<User> | null> {
    try {
      const user = await fetchUserByUsername(username);
      if (!user) return null;

      return user;
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return null;
    }
  }
}

export default SettingsService.getInstance();
