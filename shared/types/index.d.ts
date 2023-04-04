import type { User } from "./shared/types/models";

declare global {
	namespace Express {
		interface Request {
			user: User;
		}
	}
}
