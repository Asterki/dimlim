import UserModel from "../models/user";

const usersServiceAddContact = async (userID: string, contactUsername: string): Promise<"success" | "user-not-found"> => {
	const user = await UserModel.findOne({ userID: userID });
	const userContact = await UserModel.findOne({ username: contactUsername });
	if (!user || userContact == null) return "user-not-found";

	user.contacts.push({ userID: userContact.userID, username: userContact.username }); // Add to current user contacts
	userContact.contacts.push({ userID: user.userID, username: user.username }); // Add to the other person's contact

	user.save();
	userContact.save();

	return "success";
};

const usersServiceRemoveContact = async (userID: string, contactUsername: string): Promise<"success" | "user-not-found"> => {
	const user: any | null = await UserModel.findOne({ userID: userID });
	const userContact: any | null = await UserModel.findOne({ username: contactUsername });
    if (!user || userContact == null) return "user-not-found";

	user.contacts = user.contacts.filter((contact: { userID: string; username: string }) => contact.userID !== userContact!.userID);
	userContact.contacts = userContact.contacts.filter((contact: { userID: string; username: string }) => contact.userID !== user!.userID);

	user.save();
	userContact.save();

	return "success";
};

export { usersServiceAddContact, usersServiceRemoveContact };
