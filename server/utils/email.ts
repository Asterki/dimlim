import nodemailer from "nodemailer";
import validator from "validator";

const mailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST as string,
    port: parseInt(process.env.EMAIL_PORT as string),
    secure: (process.env.EMAIL_SECURE as string) == "true" ? true : false,
    auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
    },
});

const sendEmail = async (emailTo: string, subject: string, html: string) => {
    try {
        if (!validator.isEmail(emailTo)) return;

        await mailTransporter.sendMail({
            from: `"DIMLIM"`,
            to: emailTo,
            subject: subject,
            html: html,
        });
    } catch (err) {
        throw err;
    }
};

export { mailTransporter, sendEmail };
