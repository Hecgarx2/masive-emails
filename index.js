const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { sendMail } = require("./services/mailServices");
const { formatDate } = require("./services/formatDate");
const { readExcelFile } = require('./services/readExcel');
const { rowToEmailPayload } = require('./mappers/rowToEmailPayload');
const { renderTemplate } = require("./services/renderTemplate");
const multer = require("multer");
const path = require('path');
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/send-email", upload.single("file") , async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({error: "No file uploaded."});
    }

    const data = await readExcelFile(req.file.buffer);
    const date = formatDate();

    for (const row of data) {
      const payload = rowToEmailPayload(row);
      payload.date = date;
      if (!payload.email) {
        console.warn(`No email found for row with FOLIO: ${payload.folio}`);
        continue; // Saltar filas sin correo electrónico
      }
      const response = await sendMail(payload.email, 'test', payload);
      if (!response) {
        console.error(`Failed to send email to: ${payload.folio}`);
      }
    }
    // Responder al frontend
    return res.json({
        success: true,
        code: 200,
        message: "Excel leído correctamente",
        rows: data,
    });

  } catch (error) {
    console.error("Error leyendo el Excel:", error);
    return res.status(500).json({ error: "Error procesando el archivo" });
  }
});

app.get("/preview/template", (req, res) => {
  try {
    // leer imagen y convertir a base64
    const pathMedioAmbiente = path.join(__dirname, 'assets', 'medioAmbiente.png');
    const imgData1 = fs.readFileSync(pathMedioAmbiente);
    const imgMedioAmbiente = `data:image/png;base64,${imgData1.toString('base64')}`;

    
    const pathZapopan = path.join(__dirname, 'assets', 'logoZapopan.png');
    const imgData = fs.readFileSync(pathZapopan);
    const imgZapopan = `data:image/png;base64,${imgData.toString('base64')}`;

    const html = renderTemplate("pdf", {
      date: new Date().toLocaleDateString(),
      imageSrc: imgMedioAmbiente,
      logoSrc: imgZapopan
    });

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al generar preview');
  }
});


dotenv.config();
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

// sendMail('emmanuel.garcia@zapopan.gob.mx', 'test', { date: fechaFormateada, folio: '0884-25', application: '0315-25', name: 'ABASTECEDORA EL TRIUNFO, S.A DE C.V.', address: 'C. OCAMPO MELCHOR # 1270 COL. VIGIA', opinion: 'Favorable', id: '5311' })
