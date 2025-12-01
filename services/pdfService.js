const fs = require("fs");
const puppeteer = require("puppeteer");

async function generatePDF(html) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulateMediaType("screen");
  await page.setContent(html, {
    waitUntil: "networkidle0",
  });
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true, // <<==== NECESARIO PARA COLORES Y BACKGROUNDS
    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px",
    }
  });
  await browser.close();
  return pdfBuffer;
}
module.exports = { generatePDF };