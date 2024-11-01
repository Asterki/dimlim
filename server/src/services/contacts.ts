import UserModel from '../models/Users';

import Logger from '../utils/logger';
import { fetchUserByID, fetchUserByUsername } from '../utils/users';

class ContactService {
  private static instance: ContactService;

  private constructor() {}

  public static getInstance(): ContactService {
    if (!ContactService.instance) {
      ContactService.instance = new ContactService();
    }
    return ContactService.instance;
  }

  public async removeContact(userID: string, contactID: string) {
    try {
      const user = await fetchUserByID(userID);
      if (!user) return 'user-not-found'; // You wouldn't get here without an account so...

      const contact = await fetchUserByID(contactID);
      if (!contact) {
        // If the contact deleted their account
        user.contacts.accepted = user.contacts.accepted.filter((id) => id !== contactID);
        await user.save();
        return 'success';
      }

      if (!user.contacts.accepted.includes(contactID)) return 'not-contact';

      user.contacts.accepted = user.contacts.accepted.filter((id) => id !== contactID);
      contact.contacts.accepted = contact.contacts.accepted.filter((id) => id !== contact.userID);

      await contact.save();
      await user.save();

      return 'success';
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async blockContact(userID: string, contactID: string) {
    try {
      const user = await fetchUserByID(userID);
      if (!user) return 'user-not-found';

      if (!user.contacts.accepted.includes(contactID)) return 'not-contact';

      const contact = await fetchUserByID(contactID);
      if (!contact) return this.removeContact(userID, contactID); // If the contact deleted their account

      await UserModel.updateOne(
        { userID: user.userID },
        { $addToSet: { 'contacts.blocked': contact.userID } },
        { new: true },
      );

      return 'success';
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async unblockContact(userID: string, contactID: string) {
    try {
      const user = await fetchUserByID(userID);
      if (!user) return 'user-not-found';

      if (!user.contacts.blocked.includes(contactID)) return 'not-contact';

      const contact = await fetchUserByID(contactID);
      if (!contact) return this.removeContact(userID, contactID);

      await UserModel.updateOne(
        { userID: user.userID },
        { $pull: { 'contacts.blocked': contact.userID } },
        { new: true },
      );

      return 'success';
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async getProfile(contactUsername: string): Promise<any> {
    try {
      const user = await fetchUserByUsername(contactUsername);
      if (!user) return 'user-not-found';

      if (user.contacts.blocked.includes(user.userID)) return 'contact-blocked';
      if (!user.contacts.accepted.includes(user.userID)) return 'not-contact';

      return user.profile;
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async acceptContact(userID: string, contactID: string) {
    try {
      const user = await fetchUserByID(userID);
      if (!user) return 'user-not-found';

      const contact = await fetchUserByUsername(contactID);
      if (!contact) {
        user.contacts.requests = user.contacts.requests.filter((id) => id !== contactID);
        await user.save();
        return 'user-not-found';
      }

      if (!contact.contacts.pending.includes(user.userID)) return 'no-request';

      // Add contact to "accepted" list
      await UserModel.updateOne(
        { userID: user.userID },
        { $addToSet: { 'contacts.accepted': contact.userID } },
        { new: true },
      );

      // Add user to "accepted" list
      await UserModel.updateOne(
        { userID: contact.userID },
        { $addToSet: { 'contacts.accepted': user.userID } },
        { new: true },
      );

      // Remove contact from "requests" list
      await UserModel.updateOne(
        { userID: user.userID },
        { $pull: { 'contacts.requests': contact.userID } },
        { new: true },
      );

      // Remove user from "pending" list
      await UserModel.updateOne(
        { userID: contact.userID },
        { $pull: { 'contacts.pending': user.userID } },
        { new: true },
      );

      return 'success';
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async rejectContact(userID: string, contactID: string) {
    try {
      const user = await fetchUserByID(userID);
      if (!user) return 'user-not-found';

      const contact = await fetchUserByID(contactID);
      if (!contact) {
        user.contacts.requests = user.contacts.requests.filter((id) => id !== contactID);
        await user.save();
        return 'user-not-found';
      }

      if (!contact.contacts.requests.includes(user.userID)) return 'no-request';

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
      Logger.error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async addContact(userID: string, contactUsername: string) {
    try {
      const user = await fetchUserByID(userID);
      if (!user) return 'user-not-found';

      const contact = await fetchUserByUsername(contactUsername);
      if (!contact) return 'contact-not-found';

      if (contact.contacts.blocked.includes(contact.userID)) return 'user-blocked';
      if (contact.contacts.requests.includes(contact.userID)) return 'request-pending';
      if (contact.contacts.accepted.includes(contact.userID)) return 'already-contact';

      if (contact.contacts.blocked.includes(user.userID)) return 'contact-blocked';
      if (contact.contacts.pending.includes(user.userID)) return 'contact-request-sent';
      if (contact.contacts.accepted.includes(user.userID)) return 'already-contact';

      if (contact.contacts.requests.includes(user.userID) || contact.contacts.pending.includes(contact.userID)) {
        await this.acceptContact(user.userID, contact.profile.username);
      }

      await UserModel.updateOne(
        { userID: user.userID },
        { $addToSet: { 'contacts.requests': contact.userID } },
        { new: true },
      );

      await UserModel.updateOne(
        { userID: contact.userID },
        { $addToSet: { 'contacts.pending': user.userID } },
        { new: true },
      );

      return 'success';
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return 'internal-error';
    }
  }
}

export default ContactService.getInstance();
