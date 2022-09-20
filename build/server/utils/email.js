"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.mailTransporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const validator_1 = __importDefault(require("validator"));
const mailTransporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE == "true" ? true : false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
exports.mailTransporter = mailTransporter;
const sendEmail = (emailTo, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    if (!validator_1.default.isEmail(emailTo))
        return;
    yield mailTransporter.sendMail({
        from: `"DIMLIM"`,
        to: emailTo,
        subject: subject,
        html: html,
    });
});
exports.sendEmail = sendEmail;
