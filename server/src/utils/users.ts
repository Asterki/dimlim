import { HydratedDocument } from 'mongoose';

import UserModel from '../models/Users';
import { User } from '../../../shared/types/models';

import Logger from 'file-error-logging/dist/cjs';

const fetchUserByID = async (userID: string): Promise<HydratedDocument<User> | null> => {
  try {
    const user: HydratedDocument<User> | null = await UserModel.findOne({
      userID,
    });
    return user;
  } catch (error: unknown) {
    Logger.log("error", (error as Error).message);
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
    Logger.log("error", (error as Error).message);
    return null;
  }
};

export { fetchUserByID, fetchUserByUsername };
