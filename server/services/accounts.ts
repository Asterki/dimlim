import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import expressSession from "express-session";
import mongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import passportLocal from "passport-local";
import passport from "passport";
import express from "express";
import speakeasy from "speakeasy";

import { app } from "../";

import UserModel from "../models/user";

import type { User } from "../../shared/types/models";
import { Document } from "mongoose";

// Cookie session
app.use(
	expressSession({
		secret: process.env.SESSION_SECRET as string,
		resave: false,
		saveUninitialized: true,
		store: mongoStore.create({
			mongoUrl: process.env.MONGODB_URI as string,
		}),
		cookie: {
			secure: (process.env.COOKIE_SECURE as string) == "true",
			maxAge: parseInt(process.env.COOKIE_MAX_AGE as string) || 604800000,
		},
	})
);

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());

// Auth Strategy
passport.use(
	new passportLocal.Strategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
			session: true,
		},
		async (req: express.Request, _email: string, _password: string, done) => {
			try {
				const user: (User & Document) | null = await UserModel.findOne({
					$or: [{ "email.value": req.body.email }, { username: req.body.email }],
				});
				if (!user) return done(null, false, { message: "invalid-credentials" });

				// Verify password and TFA code
				if (!bcrypt.compareSync(req.body.password, user.password)) return done(null, false, { message: "invalid-credentials" });
				if (user.tfa.secret !== "") {
					if (!req.body.tfaCode) return done(null, false, { message: "requires-tfa" });

					const verified = speakeasy.totp.verify({
						secret: user.tfa.secret,
						encoding: "base32",
						token: req.body.tfaCode,
					});

					if (verified == false) return done(null, false, { message: "invalid-tfa-code" });
				}

				return done(null, user);
			} catch (err: unknown) {
				return done(err);
			}
		}
	)
);

// For authentication on each request
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

const accountsServiceRegisterUser = async (username: string, email: string, password: string): Promise<User | "username-email-in-use"> => {
	const userFound: (User & Document) | null = await UserModel.findOne({ $or: [{ username: username }, { email: email }] });
	if (userFound) return "username-email-in-use";

	const makeId = (length: number) => {
		let result = "";
		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	};

	const userID = uuidv4();

	const user = new UserModel({
		userID: userID,
		created: Date.now(),
		username: username.toLocaleLowerCase(),

		email: {
			value: email,
		},

		password: bcrypt.hashSync(password, 10),
		chatSecret: uuidv4(),
		encSecret: makeId(16),
	});

	user.save();
	return user;
};

const accountsServiceDeleteUser = async (
	user: User,
	password: string,
	tfaCode: string
): Promise<"requires-tfa" | "invalid-password" | "invalid-tfa" | "done"> => {
	// Comparing password and tfa
	if (!bcrypt.compareSync(password, user.password)) return "invalid-password";

	// TODO: REFACTOR THIS PROCESS
	if (user.tfa.secret !== "") {
		if (!tfaCode) return "requires-tfa";

		const verified = speakeasy.totp.verify({
			secret: user.tfa.secret,
			encoding: "base32",
			token: tfaCode,
		});

		if (verified == false) return "invalid-tfa";
	}

	await UserModel.deleteOne({ userID: user.userID });
	return "done";
};

export { accountsServiceRegisterUser, accountsServiceDeleteUser };
