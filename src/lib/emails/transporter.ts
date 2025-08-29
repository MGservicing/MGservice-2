import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // support@monopolygoservicing.com
    pass: process.env.EMAIL_PASS, // Google App Password
  },
});
