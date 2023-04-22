import { User as IUser } from "../shared/types/models";

interface Contact {
	userID: string;
	username: string;
	muted: boolean;
}

interface EmailVerificationCode {
	code: string;
	email: string;
	expires: number;
}

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			user?: IUser;
		}
	}
}

export type { EmailVerificationCode, Contact };
