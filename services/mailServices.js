const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const { default: hbs } = require('nodemailer-express-handlebars');
const path = require('path');
const fs = require("fs");
const { generatePDF } = require('./pdfService');
const { renderTemplate } = require('./renderTemplate');

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
    // Read and convert images to base64
    const pathMedioAmbiente = path.join(__dirname,'..', 'assets', 'medioAmbiente.png');
    const imgData1 = fs.readFileSync(pathMedioAmbiente);
    const imgMedioAmbiente = `data:image/png;base64,${imgData1.toString('base64')}`;

    
    const pathZapopan = path.join(__dirname,'..', 'assets', 'logoZapopan.png');
    const imgData = fs.readFileSync(pathZapopan);
    const imgZapopan = `data:image/png;base64,${imgData.toString('base64')}`;

    context.imageSrc = imgMedioAmbiente;
    context.logoSrc = imgZapopan;
    // Render HTML with Handlebars
    const html = renderTemplate("pdf", context );
    // 2. Generate PDF from HTML
    const pdfBuffer = await generatePDF(html);
    const info = await transporter.sendMail({
      from: 'hectorgarx2@gmail.com',
      to,
      subject,
      template: 'template',
      context,
      attachments: [
        {
          filename: 'papeleta.pdf',
          content: pdfBuffer,
        }
      ],
    });

    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = { sendMail }