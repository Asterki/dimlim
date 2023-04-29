import mongoose from "mongoose";
const Schema = mongoose.Schema;

const EmailVerificationCode = new Schema({
    code:  {
		type: String,
		required: true,
		unique: true,
	},
    userID: {
        type: String,
        required: true,
    },
    expires: {
        type: Number,
        required: true
    }
})

export default mongoose.model("EmailVerificationCode", EmailVerificationCode, "email-verification-codes");
