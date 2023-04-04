interface User {
	userID: string;
	created: number;

	username: string;
	email: {
		value: string;
		verified: boolean;
	};

	avatar: string;
	locale: string;

	contacts: Array<{
		userID: string;
		username: string;
	}>;
	blockedContacts: Array<{
		userID: string;
		username: string;
	}>;

	password: string;
	chatSecret: string;
	encSecret: string;

	tfa: {
		secret: string;
		backupCodes: Array<string>;
		seenBackupCodes: boolean;
	};
}

export type { User };
