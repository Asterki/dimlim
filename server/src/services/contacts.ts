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

  public async getUserByID(userID: string) {
    const user = await fetchUserByID(userID);
    if (!user) return 'user-not-found';
    return user;
  }

  public async getUserByUsername(username: string) {
    const user = await fetchUserByUsername(username);
    if (!user) return 'user-not-found';
    return user;
  }

  private async updateUserContacts(userID: string, update: any) {
    await UserModel.updateOne({ userID }, update, { new: true });
  }

  public async removeContact(userID: string, contactID: string) {
    try {
      if (userID == contactID) return 'self-remove';

      const user = await this.getUserByID(userID);
      if (user == 'user-not-found') return 'user-not-found';

      const contact = await fetchUserByID(contactID);

      if (!contact) {
        user.contacts.accepted = user.contacts.accepted.filter((id) => id !== contactID);
        await user.save();
        return 'success';
      }

      if (!user.contacts.accepted.includes(contactID)) return 'not-contact';

      user.contacts.accepted = user.contacts.accepted.filter((id) => id !== contactID);
      contact.contacts.accepted = contact.contacts.accepted.filter((id) => id !== user.userID);

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
      if (userID == contactID) return 'self-block';

      const user = await this.getUserByID(userID);
      if (user == 'user-not-found') return 'user-not-found';

      if (!user.contacts.accepted.includes(contactID)) return 'not-contact';

      const contact = await fetchUserByID(contactID);
      if (!contact) return this.removeContact(userID, contactID);

      await this.updateUserContacts(user.userID, { $addToSet: { 'contacts.blocked': contact.userID } });

      return 'success';
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async unblockContact(userID: string, contactID: string) {
    try {
      if (userID == contactID) return 'self-unblock';

      const user = await this.getUserByID(userID);
      if (user == 'user-not-found') return 'user-not-found';

      if (!user.contacts.blocked.includes(contactID)) return 'not-contact';

      const contact = await fetchUserByID(contactID);
      if (!contact) return this.removeContact(userID, contactID);

      await this.updateUserContacts(user.userID, { $pull: { 'contacts.blocked': contact.userID } });

      return 'success';
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async getProfile(contactID: string | string[]) {
    try {
      if (!Array.isArray(contactID)) contactID = [contactID];

      const contacts = await UserModel.find({ userID: { $in: contactID } });

      return contacts.map((contact) => ({
        userID: contact.userID,
        profile: contact.profile as {
          username: string;
          avatar: string;
          imageID: string;
          website: string;
          bio: string;
        },
      }));
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async acceptContact(userID: string, contactID: string) {
    try {
      if (userID == contactID) return 'self-accept';

      const user = await this.getUserByID(userID);
      if (user == 'user-not-found') return 'user-not-found';

      const contact = await this.getUserByID(contactID);
      if (contact == 'user-not-found') return 'user-not-found';

      if (!contact.contacts.pending.includes(user.userID)) return 'no-request';

      await this.updateUserContacts(user.userID, {
        $addToSet: { 'contacts.accepted': contact.userID },
        $pull: { 'contacts.requests': contact.userID },
      });
      await this.updateUserContacts(contact.userID, {
        $addToSet: { 'contacts.accepted': user.userID },
        $pull: { 'contacts.pending': user.userID },
      });

      return 'success';
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async rejectContact(userID: string, contactID: string) {
    try {
      if (userID == contactID) return 'self-reject';

      const user = await this.getUserByID(userID);
      if (user == 'user-not-found') return 'user-not-found';

      const contact = await fetchUserByID(contactID);

      if (!contact) {
        user.contacts.requests = user.contacts.requests.filter((id) => id !== contactID);
        await user.save();
        return 'user-not-found';
      }

      if (!contact.contacts.pending.includes(user.userID)) return 'no-request';

      await this.updateUserContacts(user.userID, { $pull: { 'contacts.requests': contact.userID } });
      await this.updateUserContacts(contact.userID, { $pull: { 'contacts.pending': user.userID } });

      return 'success';
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async addContact(userID: string, contactID: string) {
    try {
      if (userID == contactID) return 'self-add';

      const user = await this.getUserByID(userID);
      if (user == 'user-not-found') return 'user-not-found';

      const contact = await this.getUserByID(contactID);
      if (contact == 'user-not-found') return 'user-not-found';

      if (contact.contacts.blocked.includes(contact.userID)) return 'user-blocked';
      if (contact.contacts.pending.includes(contact.userID)) return 'request-pending';
      if (contact.contacts.accepted.includes(contact.userID)) return 'already-contact';

      if (contact.contacts.blocked.includes(user.userID)) return 'contact-blocked';
      if (contact.contacts.requests.includes(user.userID)) return 'contact-request-sent';
      if (contact.contacts.accepted.includes(user.userID)) return 'already-contact';

      if (contact.contacts.pending.includes(user.userID)) {
        await this.acceptContact(user.userID, contact.profile.username);
        await this.acceptContact(contact.profile.username, user.userID);
      }

      await this.updateUserContacts(user.userID, { $addToSet: { 'contacts.pending': contact.userID } });
      await this.updateUserContacts(contact.userID, { $addToSet: { 'contacts.requests': user.userID } });

      return 'success';
    } catch (error: unknown) {
      Logger.error((error as Error).message, true);
      return 'internal-error';
    }
  }

  public async cancelRequest(userID: string, contactID: string) {
    if (userID == contactID) return 'self-remove';

    const user = await this.getUserByID(userID);
    if (user == 'user-not-found') return 'user-not-found';

    const contact = await fetchUserByID(contactID);
    if (!contact) {
      user.contacts.requests = user.contacts.requests.filter((id) => id !== contactID);
      await user.save();
      return 'success';
    }

    if (!user.contacts.pending.includes(contactID)) return 'not-contact';
    user.contacts.pending = user.contacts.pending.filter((id) => id !== contactID);

    contact.contacts.requests = contact.contacts.requests.filter((id) => id !== user.userID);

    await contact.save();
    await user.save();

    return 'success';
  }
}

export default ContactService.getInstance();
