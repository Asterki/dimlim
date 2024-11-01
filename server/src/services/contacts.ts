import UserModel from '../models/Users';
import { HydratedDocument } from 'mongoose';

import Logger from '../utils/logger';

import { User } from '../../../shared/types/models';

const fetchUserByUsername = async (username: string) => {
  try {
    const user: HydratedDocument<User> | null = await UserModel.findOne({
      'profile.username': username.toLowerCase(),
    });
    return user;
  } catch (error: unknown) {
    Logger.getInstance().error((error as Error).message, true);
    return null;
  }
};

const fetchUserByID = async (userID: string) => {
  try {
    const user: HydratedDocument<User> | null = await UserModel.findOne({
      userID,
    });
    return user;
  } catch (error: unknown) {
    Logger.getInstance().error((error as Error).message, true);
    return null;
  }
};

const addContact = async (userID: string, contactUsername: string) => {
  try {
    const user = await fetchUserByID(userID);
    if (!user) return; // I'm not sure how someone would even get here but okay, typescript is a crybaby so we're not going to argue with it

    const contact = await fetchUserByUsername(contactUsername);
    if (!contact) return 'contact-not-found';

    if (contact.contacts.blocked.includes(contact.userID)) return 'user-blocked'; // I'm looking at you again timmy
    if (contact.contacts.requests.includes(contact.userID)) return 'request-pending';
    if (contact.contacts.pending.includes(contact.userID)) return 'request-sent';
    if (contact.contacts.accepted.includes(contact.userID)) return 'already-contact';

    if (contact.contacts.blocked.includes(user.userID)) return 'contact-blocked';
    if (contact.contacts.pending.includes(user.userID)) return 'contact-request-sent';
    if (contact.contacts.accepted.includes(user.userID)) return 'already-contact';

    // How cute, they both want to be friends
    if (contact.contacts.requests.includes(user.userID)) {
      // TODO: Update both users' contacts
    }

    // Update current user's pending contacts
    await UserModel.updateOne(
      { userID: user.userID },
      { $addToSet: { 'contacts.pending': contact.userID } },
      { new: true },
    );

    // Update the other user's pending contacts, if they're not blocked
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
};

const removeContact = async (userID: string, contactUsername: string) => {
  try {
    const user = await fetchUserByID(userID);
    if (!user) return 'user-not-found';

    const contact = await fetchUserByUsername(contactUsername);
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
};

const blockContact = async (userID: string, contactUsername: string) => {
  try {
    const user = await fetchUserByID(userID);
    if (!user) return 'user-not-found';

    const contact = await fetchUserByUsername(contactUsername);
    if (!contact) return 'contact-not-found';

    // If the contact is here we'll assume they're not blocked
    if (!user.contacts.accepted.includes(contact.userID)) return 'not-contact';

    // Update current user's blocked contacts
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
};

const unblockContact = async (userID: string, contactUsername: string) => {
  try {
    const user = await fetchUserByID(userID);
    if (!user) return 'user-not-found';

    const contact = await fetchUserByUsername(contactUsername);
    if (!contact) return 'contact-not-found';

    // If the contact is here we'll assume they're not blocked
    if (!user.contacts.blocked.includes(contact.userID)) return 'not-contact';

    // Update current user's blocked contacts
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
};

const getProfile = async (contactUsername: string) => {
  try {
    const user = await fetchUserByUsername(contactUsername);
    if (!user) return 'user-not-found';

    if (user.contacts.blocked.includes(user.userID)) return 'contact-blocked';
    if (!user.contacts.accepted.includes(user.userID)) return 'not-contact';

    return user.profile;
  } catch (error: unknown) {
    Logger.getInstance().error((error as Error).message, true);
    return 'internal-error';
  }
};

const acceptContact = async (userID: string, contactUsername: string) => {
  try {
    const user = await fetchUserByID(userID);
    if (!user) return 'user-not-found';

    const contact = await fetchUserByUsername(contactUsername);
    if (!contact) return 'contact-not-found';

    if (!contact.contacts.requests.includes(user.userID)) return 'no-request';

    // Update current user's accepted contacts
    await UserModel.updateOne(
      { userID: user.userID },
      { $addToSet: { 'contacts.accepted': contact.userID } },
      { new: true },
    );

    // Update the other user's accepted contacts
    await UserModel.updateOne(
      { userID: contact.userID },
      { $addToSet: { 'contacts.accepted': user.userID } },
      { new: true },
    );

    // Remove from the requests and pending
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
};

export { addContact, removeContact, blockContact, unblockContact, getProfile, acceptContact };
