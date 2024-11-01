import UserModel from '../models/Users';
import { HydratedDocument } from 'mongoose';

import Logger from '../utils/logger';

import { User } from '../../../shared/types/models';

class ProfileService {
  private static instance: ProfileService;

  private constructor() {}

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  private async fetchUserByUsername(username: string): Promise<HydratedDocument<User> | null> {
    try {
      const user: HydratedDocument<User> | null = await UserModel.findOne({
        'profile.username': username.toLowerCase(),
      });
      return user;
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return null;
    }
  }

  private async fetchUserByID(userID: string): Promise<HydratedDocument<User> | null> {
    try {
      const user: HydratedDocument<User> | null = await UserModel.findOne({
        userID,
      });
      return user;
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return null;
    }
  }

  public async updateProfile(userID: string, data: Partial<User>): Promise<string> {
    try {
      const user = await this.fetchUserByID(userID);
      if (!user) return 'user-not-found';

      if (data.profile && data.profile.username) {
        const existingUser = await this.fetchUserByUsername(data.profile.username);
        if (existingUser && existingUser.userID !== userID) return 'username-taken';
      }

      user.set(data);
      await user.save();

      return 'success';
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return 'error';
    }
  }

  public async fetchProfile(username: string): Promise<HydratedDocument<User> | null> {
    try {
      const user = await this.fetchUserByUsername(username);
      if (!user) return null;

      return user;
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return null;
    }
  }

  public async fetchProfileByID(userID: string): Promise<HydratedDocument<User> | null> {
    try {
      const user = await this.fetchUserByID(userID);
      if (!user) return null;

      return user;
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return null;
    }
  }
}

export default ProfileService.getInstance();
