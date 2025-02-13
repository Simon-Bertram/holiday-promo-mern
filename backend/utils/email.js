import nodemailer from "nodemailer";
// import { randomBytes } from "crypto";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
});

export function generateMagicCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export function sendMagicCodeEmail(email, token) {
  const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `
    <p>Click <a href="${verificationLink}">here</a> to verify your email</p>
    `,
  };
}
