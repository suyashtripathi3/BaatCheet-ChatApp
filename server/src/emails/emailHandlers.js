import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createWelcomeEmailTemplate } from "./emailTemplates.js"; // <- corrected path
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendWelcomeEmail = async (toEmail, name, clientURL) => {
  try {
    const htmlContent = createWelcomeEmailTemplate(name, clientURL);

    const mailOptions = {
      from: `"BaatCheet Team" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Welcome to BaatCheet!",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:", info.messageId);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
};
