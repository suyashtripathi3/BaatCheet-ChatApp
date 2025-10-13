import emailjs from "@emailjs/browser";

export const sendWelcomeEmail = async (toEmail, name, clientURL) => {
  try {
    const res = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        name: name,
        email: toEmail,
        clientURL: clientURL,
        companyName: "BaatCheet"
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    console.log("📧 Email sent!", res.status, res.text);
  } catch (error) {
    console.error("❌ EmailJS Error:", error);
  }
};
