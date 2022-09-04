import nodemailer from "nodemailer";
import validator from "validator";

const mailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        
    },
});

const sendEmail = async (emailTo: string, subject: string, html: string) => {
    if (!validator.isEmail(emailTo)) return;

    await mailTransporter.sendMail({
        from: `"DIMLIM"`,
        to: emailTo,
        subject: subject,
        html: html,
    });
};

export { mailTransporter, sendEmail };
