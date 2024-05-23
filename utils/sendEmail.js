import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    port: process.env.SEND_EMAIL_PORT,
    service: process.env.SEND_EMAIL_SERVICE, // sMPT_SERVICE
    auth: {
      user: process.env.SEND_EMAIL_SMPT_MAIL, //SMPT_MAIL
      pass: process.env.SEND_EMAIL_SMPT_PASSWORD, // SMPT_PASSWORD
    },
  });
  const mailOptions = {
    from: process.env.SEND_EMAIL_SMPT_MAIL,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
