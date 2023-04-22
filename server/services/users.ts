import { Document } from "mongoose";
import { User } from "../../shared/types/models";
import UserModel from "../models/user";

const usersServiceAddContact = async (userID: string, contactUsername: string): Promise<"success" | "user-not-found"> => {
	// Find the users
	const user: (User & Document) | null = await UserModel.findOne({ userID: userID });
	const userContact: (User & Document) | null = await UserModel.findOne({ username: contactUsername });
	if (!user || userContact == null) return "user-not-found";

	user.contacts.push({ userID: userContact.userID, username: userContact.username }); // Add to current user contacts
	userContact.contacts.push({ userID: user.userID, username: user.username }); // Add to the other person's contact

	// Save
	user.save();
	userContact.save();

	return "success";
};

const usersServiceRemoveContact = async (userID: string, contactUsername: string): Promise<"success" | "user-not-found"> => {
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

	return "success";
};

const changeEmail = async (newEmail: string, userID: string): Promise<"email-in-use" | "success"> => {
    // Check if the new email is in use
	const isInUseResult: (User & Document) | null = await UserModel.findOne({ "email.value": newEmail });
	if (isInUseResult !== null) return "email-in-use";

    // Get the user document and update it
	const user: (User & Document) | null = await UserModel.findOne({ userID: userID });
	user!.email = {
		value: newEmail,
		verified: false,
	};

    // Save it and send success signal
	user!.save();
	return "success";
};

export { usersServiceAddContact, usersServiceRemoveContact, changeEmail };
