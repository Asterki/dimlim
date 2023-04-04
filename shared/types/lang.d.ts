declare const LangPack: {
	main: {
		welcome: {
			title: string;
			security: string;
			securityDesc: string;
			privacy: string;
			privacyDesc: string;
			velocity: string;
			velocityDesc: string;
			navbar: {
				login: string;
				register: string;
			};
		};
		home: {
			pageTitle: string;
			title: string;
			navbar: {
				profile: string;
				settings: string;
				logout: string;
			};
			contacts: string;
			blocked: string;
			addContact: string;
			noContacts: string;
			blockedContacts: string;
			noBlockedContacts: string;
			newMessageNotification: string;
			dialogs: {
				addContact: {
					title: string;
					label: string;
					cancel: string;
					add: string;
					"missing-parameters": string;
					"self-add": string;
					"already-on-list": string;
					"user-not-found": string;
				};
			};
		};
	};
	accounts: {
		login: {
			pageTitle: string;
			title: string;
			email: string;
			password: string;
			tfa: string;
			login: string;
			submit: string;
			forgotPassword: string;
			doNotHaveAnAccount: string;
			tfaHelp: string;
			close: string;
			errors: {
				"invalid-email": string;
				"invalid-password": string;

				"bad-request": string;
				"invalid-credentials": string;
				"invalid-tfa-code": string;

				"no-errors": string;
			};
		};
		register: {
			pageTitle: string;
			title: string;
			email: string;
			username: string;
			password: string;
			confirmPassword: string;
			register: string;
			alreadyHaveAnAccount: string;
			close: string;
			errors: {
				"invalid-username-length": string;
				"invalid-username": string;
				"invalid-email": string;
				"invalid-password-length": string;
				"username-email-in-use": string;
				"password-match": string;
				"no-errors": string;
			};
		};
		verifyEmail: {
			pageTitle: string;
			expired: string;
			invalid: string;
			successNotLoggedIn: string;
			successLoggedIn: string;
			login: string;
			goHome: string;
			navbar: {
				login: string;
				register: string;
				about: string;
				support: string;
				download: string;
				profile: string;
				settings: string;
				logout: string;
			};
		};
	};
	settings: {
		index: {
			pageTitle: string;
			title: string;
			navbar: {
				profile: string;
				settings: string;
				logout: string;
			};
			tabs: {
				general: string;
				security: string;
				privacy: string;
				account: string;
			};
			general: {
				title: string;
				username: string;
				bio: string;
				email: string;
				preferredLanguage: string;
				contacts: string;
				blockedContacts: string;
				creation: string;
				locales: {
					de: string;
					en: string;
					es: string;
					fr: string;
					pr: string;
				};
				dialogs: {
					avatar: {
						title: string;
						cancel: string;
						yes: string;
					};
					email: {
						title: string;
						subTitle: string;
						newEmail: string;
						password: string;
						cancel: string;
						yes: string;
						missing: string;
						invalidEmail: string;
						"email-already-in-use": string;
						"user-not-found": string;
						"rate-limit-exceeded": string;
					};
					language: {
						title: string;
						subTitle: string;
						cancel: string;
						change: string;
					};
					bio: {
						title: string;
						cancel: string;
						change: string;
					};
				};
			};
			security: {
				password: string;
				tfa: string;
				tfaActive: string;
				tfaNotActive: string;
				dialogs: {
					password: {
						title: string;
						old: string;
						new: string;
						tfa: string;
						cancel: string;
						change: string;
						unauthorized: string;
						"missing-parameters": string;
						"invalid-parameters": string;
						"invalid-tfa-code": string;
						"rate-limit-exceeded": string;
					};
					setupTfa: {
						title: string;
						subTitle: string;
						deactivateLabel: string;
						emailVerified: string;
						activate: string;
						deactivate: string;
						cancel: string;
						ok: string;
						"missing-parameters": string;
						"invalid-tfa-code": string;
						"rate-limit-exceeded": string;
					};
					activateTfa: {
						title: string;
						warning: string;
						done: string;
					};
					backupTfa: {
						title: string;
						subTitle: string;
						warning: string;
						done: string;
						submit: string;
						"missing-parameters": string;
						"invalid-tfa-code": string;
						"rate-limit-exceeded": string;
					};
				};
			};
			account: {
				emailStatus: string;
				emailVerified: string;
				emailNotVerified: string;
				logout: string;
				logoutDesc: string;
				deleteAccount: string;
				deleteAccountDesc: string;
				dialogs: {
					verifyEmail: {
						title: string;
						subTitle: string;
						verify: string;
						cancel: string;
					};
					verificationEmailSent: {
						title: string;
						subTitle: string;
						ok: string;
					};
					logout: {
						title: string;
						warning: string;
						cancel: string;
					};
					deleteAccount: {
						title: string;
						warning: string;
						password: string;
						tfaCode: string;
						cancel: string;
						"missing-parameters": string;
						"rate-limit-exceeded": string;
						"invalid-tfa-code": string;
						unauthorized: string;
					};
				};
			};
		};
	};
	chat: {
		index: {
			intro: string;
			placeholder: string;
			dialogs: {
				profile: {
					done: string;
				};
				block: {
					warning: string;
					block: string;
					cancel: string;
				};
				delete: {
					title: string;
					warning: string;
					delete: string;
					cancel: string;
				};
				attachment: {
					title: string;
					warning: string;
					noPreview: string;
					cancel: string;
					send: string;
				};
				attachmentTooBig: {
					title: string;
					message: string;
					ok: string;
				};
			};
			navbar: {
				block: string;
				delete: string;
			};
		};
	};
};
export default LangPack;
