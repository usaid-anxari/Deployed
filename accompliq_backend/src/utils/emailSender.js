import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  // Use explicit SMTP config (not 'service')
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // auth.smtp.1and1.co.uk
    port: parseInt(process.env.EMAIL_PORT), // 587 (convert to number)
    secure: process.env.EMAIL_SECURE === "true", // false for 587
    auth: {
      user: process.env.EMAIL_USER, // no-reply@accompliq.com
      pass: process.env.EMAIL_PASS, // Accompliq@321
    },
    tls: {
      rejectUnauthorized: false, // Bypass SSL cert validation (temporary for testing)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  try {
    await transporter.verify(); // Test connection first
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
};

export default sendEmail;
