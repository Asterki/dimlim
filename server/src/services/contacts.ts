import UserModel from '../models/Users';
import { HydratedDocument } from 'mongoose';

import Logger from '../utils/logger';

import { User } from '../../../shared/types/models';

class ContactService {
  private static instance: ContactService;

  private constructor() {}

  public static getInstance(): ContactService {
    if (!ContactService.instance) {
      ContactService.instance = new ContactService();
    }
    return ContactService.instance;
  }

  private async fetchUserByUsername(username: string): Promise<HydratedDocument<User> | null> {
    try {
      const user: HydratedDocument<User> | null = await UserModel.findOne({
        'profile.username': username.toLowerCase(),
      });
      return user;
    } catch (error: unknown) {
      Logger.getInstance().error((error as Error).message, true);
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
      Logger.getInstance().error((error as Error).message, true);
      return null;
    }
  }

  public async removeContact(userID: string, contactUsername: string): Promise<string> {
    try {
      const user = await this.fetchUserByID(userID);
      if (!user) return 'user-not-found';

      const contact = await this.fetchUserByUsername(contactUsername);
      if (!contact) return 'contact-not-found';

      if (!user.contacts.accepted.includes(contact.userID)) return 'not-contact';

      user.contacts.accepted = user.contacts.accepted.filter((id) => id !== contact.userID);
      contact.contacts.accepted = contact.contacts.accepted.filter((id) => id !== contact.userID);

      await contact.save();
      await user.save();

      return 'success';
    } catch (error: unknown) {
      Logger.getInstance().error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async blockContact(userID: string, contactUsername: string): Promise<string> {
    try {
      const user = await this.fetchUserByID(userID);
      if (!user) return 'user-not-found';

      const contact = await this.fetchUserByUsername(contactUsername);
      if (!contact) return 'contact-not-found';

      if (!user.contacts.accepted.includes(contact.userID)) return 'not-contact';

      await UserModel.updateOne(
        { userID: user.userID },
        { $addToSet: { 'contacts.blocked': contact.userID } },
        { new: true },
      );

      return 'success';
    } catch (error: unknown) {
      Logger.getInstance().error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async unblockContact(userID: string, contactUsername: string): Promise<string> {
    try {
      const user = await this.fetchUserByID(userID);
      if (!user) return 'user-not-found';

      const contact = await this.fetchUserByUsername(contactUsername);
      if (!contact) return 'contact-not-found';

      if (!user.contacts.blocked.includes(contact.userID)) return 'not-contact';

      await UserModel.updateOne(
        { userID: user.userID },
        { $pull: { 'contacts.blocked': contact.userID } },
        { new: true },
      );

      return 'success';
    } catch (error: unknown) {
      Logger.getInstance().error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async getProfile(contactUsername: string): Promise<any> {
    try {
      const user = await this.fetchUserByUsername(contactUsername);
      if (!user) return 'user-not-found';

      if (user.contacts.blocked.includes(user.userID)) return 'contact-blocked';
      if (!user.contacts.accepted.includes(user.userID)) return 'not-contact';

      return user.profile;
    } catch (error: unknown) {
      Logger.getInstance().error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async acceptContact(userID: string, contactUsername: string): Promise<string> {
    try {
      const user = await this.fetchUserByID(userID);
      if (!user) return 'user-not-found';

      const contact = await this.fetchUserByUsername(contactUsername);
      if (!contact) return 'contact-not-found';

      if (!contact.contacts.requests.includes(user.userID)) return 'no-request';

      await UserModel.updateOne(
        { userID: user.userID },
        { $addToSet: { 'contacts.accepted': contact.userID } },
        { new: true },
      );

      await UserModel.updateOne(
        { userID: contact.userID },
        { $addToSet: { 'contacts.accepted': user.userID } },
        { new: true },
      );

      await UserModel.updateOne(
        { userID: user.userID },
        { $pull: { 'contacts.requests': contact.userID } },
        { new: true },
      );

      await UserModel.updateOne(
        { userID: contact.userID },
        { $pull: { 'contacts.pending': user.userID } },
        { new: true },
      );

      return 'success';
    } catch (error: unknown) {
      Logger.getInstance().error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async addContact(userID: string, contactUsername: string): Promise<string> {
    try {
      const user = await this.fetchUserByID(userID);
      if (!user) return 'user-not-found';

      const contact = await this.fetchUserByUsername(contactUsername);
      if (!contact) return 'contact-not-found';

      if (contact.contacts.blocked.includes(contact.userID)) return 'user-blocked';
      if (contact.contacts.requests.includes(contact.userID)) return 'request-pending';
      if (contact.contacts.pending.includes(contact.userID)) return 'request-sent';
      if (contact.contacts.accepted.includes(contact.userID)) return 'already-contact';

      if (contact.contacts.blocked.includes(user.userID)) return 'contact-blocked';
      if (contact.contacts.pending.includes(user.userID)) return 'contact-request-sent';
      if (contact.contacts.accepted.includes(user.userID)) return 'already-contact';

      if (contact.contacts.requests.includes(user.userID)) {
        await this.acceptContact(user.userID, contact.profile.username);
      }

      await UserModel.updateOne(
        { userID: user.userID },
        { $addToSet: { 'contacts.pending': contact.userID } },
        { new: true },
      );

      await UserModel.updateOne(
        { userID: contact.userID },
        { $addToSet: { 'contacts.requests': user.userID } },
        { new: true },
      );

      return 'success';
    } catch (error: unknown) {
      Logger.getInstance().error((error as Error).message, true);
      return 'internal-error';
    }
  }
}

export default ContactService.getInstance();