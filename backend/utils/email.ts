import nodemailer from "nodemailer";
import { randomBytes } from "crypto";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  
})

export function generateToken() {
  return randomBytes(32).toString("hex");
}

export function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.FRONTEND_URL}/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `
    <p>Click <a href="${verificationLink}">here</a> to verify your email</p>
    `,
  };
  
  export async function sendMagicLink(email: string, token: string) {
    const magicLink = `${process.env.FRONTEND_URL}/login/${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Magic Link",
        html: `
        <h1>Login to your account</h1>
        <p>Click <a href="${magicLink}">here</a> to login</p>
        `
    })
  }

  export async function sendMFACode(email: string, code: string) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "MFA Code",
        html: `
        <h1>Your MFA code is</h1>
        <p>${code}</p>
        `
    })
  }