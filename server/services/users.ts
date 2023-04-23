import bcrypt from "bcrypt";

import UserModel from "../models/user";

import { Document } from "mongoose";
import { User } from "../../shared/types/models";

const usersServiceAddContact = async (userID: string, contactUsername: string): Promise<"done" | "user-not-found"> => {
	// Find the users
	const user: (User & Document) | null = await UserModel.findOne({ userID: userID });
	const userContact: (User & Document) | null = await UserModel.findOne({ username: contactUsername });
	if (!user || userContact == null) return "user-not-found";

	user.contacts.push({ userID: userContact.userID, username: userContact.username }); // Add to current user contacts
	userContact.contacts.push({ userID: user.userID, username: user.username }); // Add to the other person's contact

	// Save
	user.save();
	userContact.save();

	return "done";
};

const usersServiceRemoveContact = async (userID: string, contactUsername: string): Promise<"done" | "user-not-found"> => {
	// Find the users
	const user: (User & Document) | null = await UserModel.findOne({ userID: userID });
	const userContact: (User & Document) | null = await UserModel.findOne({ username: contactUsername });
	if (!user || userContact == null) return "user-not-found";

	// Update contacts
	user.contacts = user.contacts.filter((contact: { userID: string; username: string }) => contact.userID !== userContact!.userID);
	userContact.contacts = userContact.contacts.filter((contact: { userID: string; username: string }) => contact.userID !== user!.userID);

	// Save
	user.save();
	userContact.save();

	return "done";
};

const changeEmail = async (password: string, newEmail: string, userID: string): Promise<"email-in-use" | "done" | "unauthorized"> => {
    // Check if the new email is in use
	const isInUseResult: (User & Document) | null = await UserModel.findOne({ "email.value": newEmail });
	if (isInUseResult !== null) return "email-in-use";

    // Get the user document and compare the passwords
	const user: (User & Document) | null = await UserModel.findOne({ userID: userID });
    if (!user) return "unauthorized" // I don't know how this would happen but if it does at least it will know what to do

    if (!bcrypt.compareSync(password, user.password)) return "unauthorized"

	user!.email = {
		value: newEmail,
		verified: false,
	};

    // Save it and send done signal
	user!.save();
	return "done";
};

export { usersServiceAddContact, usersServiceRemoveContact, changeEmail };
