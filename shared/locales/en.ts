import LangPack from "shared/types/lang";

const en: typeof LangPack = {
	main: {
		welcome: {
			title: "Welcome to the app!",

			security: "Security",
			securityDesc: "DIMLIM Uses end-to-end encryption to send messages and files",

			privacy: "Privacy",
			privacyDesc:
				"DIMLIM Doesn't collect any user or message data, our code is & Open Source &, so you can check it any time",

			velocity: "Velocity",
			velocityDesc: "DIMLIM Uses the Next.js framework, offering fast navigation",

			navbar: {
				login: "Login",
				register: "Register",
			},
		},
		home: {
			pageTitle: "DIMLIM | Home",
			title: "Home",

			profileMenu: {
				addContact: "Add Contact",
				blockedContacts: "Blocked Contacts",
				settings: "Settings",
			},
		},
		settings: {
			pageTitle: "DIMLIM | Settings",

			tabs: {
				profile: {
					tabLabel: "Profile",
					title: "Profile Overview",

					userID: "User ID:",
					emailVerified: "Email verified:",
					tfaActive: "TFA Active:",

					yes: "Yes",
					no: "No",
				},

				security: {
					tabLabel: "Security",
					title: "Security Settings",

					tfa: {
						activateTitle: "Activate TFA",
						deactivateTitle: "Disable TFA",
						description: "Add an extra layer of security by adding TFA to your account",
					},

					changePassword: {
						title: "Change password",
						description: "Change your current password",
					},
				},

				messages: {
					tabLabel: "Messages",
					title: "Message Settings",

					deleteAllMessages: {
						title: "Delete all messages",
						description: "Delete all messages stored on your device",
					},

					seeBlockedContacts: {
						title: "See blocked contacts",
						description: "See the accounts that you've blocked",
					},

					seeContacts: {
						title: "See contacts",
						description: "See the people you've added to your contacts",
					},
				},

				account: {
					tabLabel: "Account",
					title: "Account Settings",

					changeEmail: {
						title: "Change email",
						description: "Change the email you log in with",
					},

					deleteAccount: {
						title: "Delete account",
						description: "Delete your DIMLIM account",
					},

					logout: {
						title: "Logout",
						description: "Logout of your account and delete all messages stored on your device",
					},
				},
			},

			dialogs: {
				account: {
					logout: {
						title: "Logout",
						description:
							"Do you want to log out of your account? al of your messages stored on your device will be deleted",

						logout: "Logout",
						cancel: "Cancel",
					},

					changeEmail: {
						title: "Change Email",

						newEmailLabel: "Your new email:",
						currentPasswordLabel: "Your current password:",

						submit: "Submit",
						cancel: "Cancel",

						errors: {
							"no-errors": "",
							"email-in-use": "That email is already in use, please try again",
							"invalid-parameters": "Please enter a valid email",
							unauthorized: "Incorrect password, please try again",
						},
					},
					deleteAccount: {
						title: "Delete Account",
						warning: "This cannot be undone",

						passwordLabel: "Your current password",
						tfaLabel: "TFA code provided by your app",

						submit: "Delete my account",
						cancel: "Cancel",

						errors: {
							"no-errors": "",
							"invalid-password": "Invalid password, please try again",
							"invalid-tfa": "Invalid TFA code, please try again",
							"invalid-parameters": "Please fill out all fields",
							"requires-tfa":
								"Somehow you tricked the app to not send the TFA code, very funny, but you still need it",
							unauthorized: "Your session has expired, please login again",
						},
					},
				},
				security: {
					changePassword: {
						title: "Change your password",

						passwordLabel: "Your current password",
						newPasswordLabel: "Your new password",
						newPasswordConfirmLabel: "Confirm your new password",

						cancel: "Cancel",
						submit: "Submit",

						errors: {
							"no-errors": "",
							"invalid-parameters": "",
							"invalid-password":
								"Please check that both passwords match and that they're between 6 and 256 characters",
							unauthorized: "Your session has expired, please login again",
						},
					},

					activateTFA: {
						title: "Activate TFA",
						instructions:
							"Open your authenticator app, scan this code, then enter the generated code in the box below",

						label: "Generated TFA code",

						activate: "Activate",
						cancel: "Cancel",

                        errors: {
                            "no-errors": "",
                            "invalid-parameters": "Please fill out all fields",
                            "invalid-code": "Invalid code, please try again",
                            "unauthorized": "Your session has expired, please login again"
                        }
					},

                    deactivateTFA: {
                        title: "Deactivate TFA",

                        deactivate: "Deactivate",
                        cancel: "Cancel",

                        label: "Your current password",

                        errors: {
                            "no-errors": "",
                            "invalid-parameters": "",
                            "invalid-password": "Invalid password, please try again",
                            unauthorized: "Your session has expired, please login again"
                        }
                    }
				},
			},
		},
	},
	accounts: {
		login: {
			pageTitle: "DIMLIM | Login",
			title: "Login into DIMLIM",

			email: "Email",
			password: "Password",
			tfa: "Two Factor Authentication",

			login: "Login",
			submit: "Submit",
			forgotPassword: "Forgot Your Password?",
			doNotHaveAnAccount: "Don't have an account yet? Register",
			tfaHelp: "Go to your authentication app and insert the 6 digit code, or insert one of your backup codes",

			close: "Close",

			errors: {
				"invalid-email": "Please enter a valid email",
				"invalid-password": "Please fill out all fiends",

				"invalid-credentials": "Incorrect email or password, please try again",
				"invalid-tfa-code": "Incorrect TFA code, please try again",
				"invalid-parameters": "Please fill out all fiends",

				"no-errors": "",
			},
		},
		register: {
			pageTitle: "DIMLIM | Register",
			title: "Register into DIMLIM",

			email: "Email",
			username: "Username",
			password: "Password",
			confirmPassword: "Confirm Password",

			register: "Register",
			alreadyHaveAnAccount: "Already have an account? Login",

			close: "Close",

			errors: {
				"invalid-username-length": "Username must be between 3 and 32 characters",
				"invalid-username": "Usernames can only contain letters, numbers, and dots (.)",

				"invalid-email": "Invalid Email",

				"invalid-password-length": "Password must be between 8 and 256 characters",
				"password-match": "Password don't match",

				"username-email-in-use": "Email or username is already in use",
				"no-errors": "",
			},
		},
		verifyEmail: {
			pageTitle: "DIMLIM | Verify Email",

			expired: "The code is expired.",
			invalid: "The code you entered is invalid.",
			successNotLoggedIn: "Your email has been verified, you can now login into your account.",
			successLoggedIn: "Your email has been verified.",

			login: "Login",
			goHome: "Go Home",

			navbar: {
				login: "Login",
				register: "Register",
				about: "About",
				support: "Support",
				download: "Download",

				profile: "Profile",
				settings: "Settings",

				logout: "Logout",
			},
		},
	},
	settings: {
		index: {
			pageTitle: "DIMLIM | Settings",
			title: "DIMLIM Settings",

			navbar: {
				profile: "Profile",
				settings: "Settings",

				logout: "Logout",
			},

			tabs: {
				general: "General",
				security: "Security",
				privacy: "Privacy",
				account: "Account",
			},

			general: {
				title: "General Information",
				username: "Username:",
				bio: "Bio:",
				email: "Email:",
				preferredLanguage: "Preferred Language:",
				contacts: "Contacts:",
				blockedContacts: "Blocked Contacts:",
				creation: "Account creation date:",

				locales: {
					de: "Deutsch",
					en: "English",
					es: "Español",
					fr: "Français",
					pr: "Português",
				},

				dialogs: {
					avatar: {
						title: "Do you want to use this picture as your avatar?",
						cancel: "Cancel",
						yes: "Yes",
					},
					email: {
						title: "Please insert your new email",
						subTitle:
							"This email will be unverified and you'll have to go through the process of re-verifying your email",

						newEmail: "Your new email",
						password: "Your current password",

						cancel: "Cancel",
						yes: "Yes",

						missing: "Please fill all inputs",
						invalidEmail: "The email you entered is invalid",

						"email-already-in-use": "The email you entered is already in use",
						"user-not-found": "Aight mate how the hell are you doing this then, I'm not even gonna bother",
						"rate-limit-exceeded": "You've tried changing your email too many times, please try again later.",
					},
					language: {
						title: "Please select a language",
						subTitle: "This will set the app's language",

						cancel: "Cancel",
						change: "Change language",
					},
					bio: {
						title: "Please insert your new bio",
						cancel: "Cancel",
						change: "Change bio",
					},
				},
			},
			security: {
				password: "Password",
				tfa: "Two Factor Authentication",

				tfaActive: "Active",
				tfaNotActive: "Not set up",

				dialogs: {
					password: {
						title: "Change password",
						old: "Your old password",
						new: "Your new password",
						tfa: "TFA Code/Backup Code",

						cancel: "Cancel",
						change: "Change password",

						unauthorized: "Invalid password.",
						"missing-parameters": "Please fill all inputs.",
						"invalid-parameters": "Your new password should be more than 8 characters and less than 256 characters.",
						"invalid-tfa-code": "Invalid TFA code, please try again.",
						"rate-limit-exceeded": "You've tried to change your password too many times, please try again later.",
					},
					setupTfa: {
						title: "Two Factor Authentication",
						subTitle: "TFA adds an extra layer of security in which you also need a device to log into you account.",
						deactivateLabel: "TFA Code/Backup Code",

						emailVerified: "You need to verify your email to enable TFA",

						activate: "Activate",
						deactivate: "Deactivate",
						cancel: "Cancel",
						ok: "Ok",

						"missing-parameters": "Please fill all inputs.",
						"invalid-tfa-code": "Invalid TFA code, please try again.",
						"rate-limit-exceeded": "You've tried to deactivate TFA too many times, please try again later.",
					},
					activateTfa: {
						title: "Two Factor Authentication",
						warning:
							"MAKE SURE YOU ENTER THE CODE TO YOUR TFA APP, YOU WILL NOT SEE THIS CODE AGAIN, IF YOU LOSE IT, YOU LOSE YOUR ACCOUNT",
						done: "Done",
					},
					backupTfa: {
						title: "Two Factor Authentication",
						subTitle: "To confirm and to get your backup codes, please insert a code generated by your TFA app",
						warning:
							"These are your backup codes, if you lose your device you can use these codes to get back your account, you won't see them again, so save them somewhere safe.",

						done: "Done",
						submit: "Submit",

						"missing-parameters": "Please fill all inputs.",
						"invalid-tfa-code": "Invalid TFA code, please try again.",
						"rate-limit-exceeded": "You've tried to deactivate TFA too many times, please try again later.",
					},
				},
			},
			account: {
				emailStatus: "Email Status",
				emailVerified: "Email Verified",
				emailNotVerified: "Email Not Verified",

				logout: "Logout",
				logoutDesc: "Your messages will be deleted",

				deleteAccount: "Delete account",
				deleteAccountDesc: "Delete everything on your account",

				dialogs: {
					verifyEmail: {
						title: "Verify your email",
						subTitle: "Verify your email to activate TFA, and receive security updates, right into your email.",

						verify: "Verify",
						cancel: "Cancel",
					},
					verificationEmailSent: {
						title: "verify your email",
						subTitle: "We've sent an email to & with a code, it will expire in 5 hours.",
						ok: "Ok",
					},
					logout: {
						title: "Logout",
						warning: "All your messages will be deleted for security reasons.",
						cancel: "Cancel",
					},
					deleteAccount: {
						title: "Delete account",
						warning: "You won't be able to recover your account after this, proceed with caution.",

						password: "Password",
						tfaCode: "TFA Code/Backup Code",

						cancel: "Cancel",

						"missing-parameters": "Please fill all inputs.",
						"rate-limit-exceeded": "You've tried deleting your account too many times, please try again later.",
						"invalid-tfa-code": "Invalid TFA code",
						unauthorized: "Invalid password",
					},
				},
			},
		},
	},
	chat: {
		index: {
			intro: "This is the start of your chat",
			placeholder: "Message...",

			dialogs: {
				profile: {
					done: "Done",
				},
				block: {
					warning: "You will no longer receive their messages and they won't be able to invite you to group chats",
					block: "Block",
					cancel: "Cancel",
				},
				delete: {
					title: "Delete Chat",
					warning: "This cannot be undone",
					delete: "Delete",
					cancel: "Cancel",
				},
				attachment: {
					title: "Send File",
					warning: "Are you sure you want to send this file to",
					noPreview: "Can't show preview of this type of file",

					cancel: "Cancel",
					send: "Send",
				},
				attachmentTooBig: {
					title: "Send File",
					message: "The file you selected is too big, it must be under 10mb",
					ok: "Ok",
				},
			},

			navbar: {
				block: "Block",
				delete: "Delete Chat",
			},
		},
	},
};

export default en;
