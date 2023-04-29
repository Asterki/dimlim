import { emailTransporter } from "../";

import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import { v4 as uuidv4 } from "uuid";

import UserModel from "../models/user";
import EmailVerificationCodeModel from "../models/emailverificationcode";

import { Document } from "mongoose";
import { User, EmailVerificationCode } from "../../shared/types/models";
import { getEmailContent } from "../utils/emails";

import { AvailableLocales } from "../../shared/types";

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
	user.contacts = user.contacts.filter(
		(contact: { userID: string; username: string }) => contact.userID !== userContact!.userID
	);
	userContact.contacts = userContact.contacts.filter(
		(contact: { userID: string; username: string }) => contact.userID !== user!.userID
	);

	// Save
	user.save();
	userContact.save();

	return "done";
};

const usersServiceChangeEmail = async (
	password: string,
	newEmail: string,
	userID: string
): Promise<"email-in-use" | "done" | "unauthorized"> => {
	// Check if the new email is in use
	const isInUseResult: (User & Document) | null = await UserModel.findOne({ "email.value": newEmail });
	if (isInUseResult !== null) return "email-in-use";

	// Get the user document and compare the passwords
	const user: (User & Document) | null = await UserModel.findOne({ userID: userID });
	if (!user) return "unauthorized"; // I don't know how this would happen but if it does at least it will know what to do

	if (!bcrypt.compareSync(password, user.password)) return "unauthorized";

	user!.email = {
		value: newEmail,
		verified: false,
	};

	// Save it and send done signal
	user!.save();
	return "done";
};

const usersServiceChangePassword = async (
	password: string,
	newPassword: string,
	userID: string
): Promise<"unauthorized" | "invalid-password" | "done"> => {
	// Validate the password
	if (password.length < 6 || password.length > 256) return "invalid-password";

	// Get the user document and compare the passwords
	const user: (User & Document) | null = await UserModel.findOne({ userID: userID });
	if (!user) return "unauthorized";

	if (!bcrypt.compareSync(password, user.password)) return "unauthorized";
	user!.password = bcrypt.hashSync(newPassword, 10);

	// Save it and send done signal
	user!.save();
	return "done";
};

const usersServiceActivateTFA = async (
	secret: string,
	code: string,
	userID: string
): Promise<"done" | "invalid-code" | "unauthorized"> => {
	const user: (User & Document) | null = await UserModel.findOne({ userID: userID });
	if (!user) return "unauthorized";

	if (user.tfa.secret !== "") return "unauthorized";

	const verified = speakeasy.totp.verify({
		secret: secret,
		encoding: "base32",
		token: code,
	});

	if (verified == false) return "invalid-code";

	// Update the secret
	user.tfa.secret = secret;
	user.save();

	return "done";
};

const usersServiceDeactivateTFA = async (
	password: string,
	userID: string
): Promise<"done" | "invalid-password" | "unauthorized"> => {
	const user: (User & Document) | null = await UserModel.findOne({ userID: userID });
	if (!user) return "unauthorized";

	if (!bcrypt.compareSync(password, user.password)) return "invalid-password";

	if (user.tfa.secret == "") return "unauthorized";
	user.tfa.secret = "";
	user.save();

	return "done";
};

const usersServiceSendEmailVerificationEmail = async (
	user: User,
	locale: AvailableLocales
): Promise<"done" | "unauthorized" | "already-verified"> => {
	if (user.email.verified) return "already-verified";

	// Delete old codes
	await EmailVerificationCodeModel.deleteMany({ userID: user.userID });

	// Generate a code
	const code = uuidv4();
	const emailVerificationCode = new EmailVerificationCodeModel({
		code: code,
		userID: user.userID,
		expires: Date.now() + 1000 * 60 * 5, // 5 minutes
	});

	emailVerificationCode.save();

	// Send the email
	const { content, subject } = await getEmailContent("verify-email", locale);

	await emailTransporter.sendMail({
		from: process.env.EMAIL_AUTH_USER,
		to: user.email.value,
		subject: subject,
		html: content
			.replace(/{username}/g, user.username)
			.replace(/{verification-link}/g, `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/verify-email?code=${code}`),
	});

	return "done";
};

const usersServiceVerifyEmail = async (code: string): Promise<"invalid-code" | "expired" | "done"> => {
	// Find and check codes
	const result: (EmailVerificationCode & Document) | null = await EmailVerificationCodeModel.findOne({ code: code });
	if (!result) return "invalid-code";
	if (result.expires > Date.now()) return "expired";

	// Find the user using the code
	const user: (User & Document) | null = await UserModel.findOne({ userID: result.userID });
	if (!user) return "invalid-code";

    // Delete all the codes belonging to that account
	await EmailVerificationCodeModel.deleteMany({ userID: user.userID });

	// Update values
	user.email.verified = true;
	user.save();

	return "done";
};

export {
	usersServiceAddContact,
	usersServiceRemoveContact,
	usersServiceChangeEmail,
	usersServiceChangePassword,
	usersServiceActivateTFA,
	usersServiceDeactivateTFA,
	usersServiceSendEmailVerificationEmail,
	usersServiceVerifyEmail,
};
