import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createWelcomeEmailTemplate } from "./emailTemplates.js"; // <- corrected path
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_API_KEY,
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
