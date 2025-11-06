const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const { default: hbs } = require('nodemailer-express-handlebars');
const path = require('path');

dotenv.config();

const handlebarOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: path.resolve('./templates'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./templates'),
  extName: '.hbs',
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

transporter.use('compile', hbs(handlebarOptions))

const sendMail = async (to, subject, context) => {
  try {
    const info = await transporter.sendMail({
      from: 'hectorgarx2@gmail.com',
      to,
      subject,
      template: 'template',
      context,
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendMail }