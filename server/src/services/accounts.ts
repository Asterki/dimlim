import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import UserModel from '../models/Users';
import PreferenceModel from '../models/Preferences';
import ContactModel from '../models/Contacts';
import ProfileModel from '../models/Profiles';

import Logger from '../utils/logger';

import type { User, Preferences } from '../../../shared/types/models';

const registerUser = async (
  email: string,
  username: string,
  password: string,
): Promise<{
  status: 'success' | 'user-exists' | 'internal-error';
  user?: User;
}> => {
  try {
    const profile = await ProfileModel.create({ username: username, email: { value: email } });
    const contacts = await ContactModel.create({});
    const preferences = await PreferenceModel.create({
      security: {
        password: await bcrypt.hash(password, 10),
      },
    });

    const user = await UserModel.create({
        userID: uuidv4(),
        pubKey: Buffer.from(''),
        created: Date.now(),
        profile: profile._id,
        contacts: contacts._id,
        preferences: preferences._id,
      });

    return {
      status: 'success',
      user: user as unknown as User,
    };
  } catch (error) {
    Logger.getInstance().error((error as Error).message, true);
    return {
      status: 'internal-error',
    };
  }
};

const deleteUser = async (
  userID: string,
  password: string,
  tfaCode?: string,
): Promise<{
  status: 'success' | 'invalid-password' | 'invalid-tfa' | 'internal-error';
}> => {
  try {
    const user = await UserModel.findOne({ userID }).populate('profile').populate('contacts').populate({ path: 'preferences', model: PreferenceModel })
    if (!user) return { status: 'internal-error' };

    console.log(user)

    // if (bcrypt.compareSync(password, (user.preferences as Preferences).password)) {
    //   return {
    //     status: 'success',
    //   };
    // }

    return {
      status: 'invalid-password',
    };
  } catch (error) {
    Logger.getInstance().error((error as Error).message, true);
    return {
      status: 'internal-error',
    };
  }
};

export { registerUser, deleteUser };
