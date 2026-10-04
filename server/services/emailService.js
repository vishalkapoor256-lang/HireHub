import "dotenv/config";
import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_APP_PASSWORD;

console.log("Email user loaded:", !!emailUser);
console.log("Email app password loaded:", !!emailPassword);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

export const sendOtpEmail = async ({
  email,
  otp,
  purpose,
}) => {
  const purposeText = {
    registration: "verify your HireHub account",
    "forgot-password": "reset your HireHub password",
    login: "complete your HireHub login",
  };

  await transporter.sendMail({
    from: `"HireHub" <${emailUser}>`,
    to: email,
    subject: "Your HireHub OTP",

    text: `
Your HireHub OTP is: ${otp}

This OTP is valid for 5 minutes.

Use this OTP to ${
      purposeText[purpose] || "continue with HireHub"
    }.

If you did not request this OTP, please ignore this email.

HireHub Team
    `,
  });
};