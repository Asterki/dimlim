import { HydratedDocument } from 'mongoose';

import UserModel from '../models/Users';
import { User } from '../../../shared/types/models';

import Logger from './logger';

const fetchUserByID = async (userID: string): Promise<HydratedDocument<User> | null> => {
  try {
    const user: HydratedDocument<User> | null = await UserModel.findOne({
      userID,
    });
    return user;
  } catch (error: unknown) {
    Logger.error((error as Error).message, true);
    return null;
  }
};

const fetchUserByUsername = async (username: string): Promise<HydratedDocument<User> | null> => {
  try {
    const user: HydratedDocument<User> | null = await UserModel.findOne({
      'profile.username': username.toLowerCase(),
    });
    return user;
  } catch (error: unknown) {
    Logger.error((error as Error).message, true);
    return null;
  }
};

export { fetchUserByID, fetchUserByUsername };
