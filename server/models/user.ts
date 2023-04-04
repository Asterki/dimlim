import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const Schema = mongoose.Schema;

const User = new Schema({
	userID: {
		type: String,
		required: true,
		unique: true,
	},
	created: {
		type: Number,
		required: true,
	},

	username: {
		type: String,
		required: true,
		unique: true,
	},

	email: {
		value: {
			type: String,
			required: true,
			unique: true,
		},
		verified: {
			type: Boolean,
			default: false,
		},
	},

	avatar: {
		type: String,
		default: "",
	},

	locale: {
		type: String,
		default: "en",
	},

	contacts: {
		type: Array,
		default: [],
	},
	blockedContacts: {
		type: Array,
		default: [],
	},

	password: {
		type: String,
		required: true,
	},
	chatSecret: {
		type: String,
		required: true,
	},
	encSecret: {
		type: String,
		required: true,
	},

	tfa: {
		secret: {
			type: String,
            default: ""
		},
		backupCodes: {
			type: Array,
            default: []
		},
		seenBackupCodes: {
			type: Boolean,
            default: false
		},
	},
});

User.plugin(passportLocalMongoose);
export default mongoose.model("User", User, "users");
