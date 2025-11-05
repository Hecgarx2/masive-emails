const nodemailer = require("nodemailer");
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendMail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: 'hectorgarx2@gmail.com',
      to,
      subject,
      text,
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendMail }