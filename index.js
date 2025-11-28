const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { sendMail } = require("./services/mailServices");
const { formatDate } = require("./services/formatDate");
const { readExcelFile } = require('./services/readExcel');
const { rowToEmailPayload } = require('./mappers/rowToEmailPayload');
const multer = require("multer");

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
    const fechaFormateada = formatDate();

    for (const row of data) {
      const payload = rowToEmailPayload(row);
      payload.date = fechaFormateada;
      if (!payload.email) {
        console.warn(`No email found for row with FOLIO: ${payload.folio}`);
        continue; // Saltar filas sin correo electrónico
      }
      sendMail(payload.email, 'test', payload);
    }
    // Responder al frontend
    return res.json({
        message: "Excel leído correctamente",
        rows: data,
    });

  } catch (error) {
    console.error("Error leyendo el Excel:", error);
    return res.status(500).json({ error: "Error procesando el archivo" });
  }
});

dotenv.config();
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

// sendMail('emmanuel.garcia@zapopan.gob.mx', 'test', { date: fechaFormateada, folio: '0884-25', application: '0315-25', name: 'ABASTECEDORA EL TRIUNFO, S.A DE C.V.', address: 'C. OCAMPO MELCHOR # 1270 COL. VIGIA', opinion: 'Favorable', id: '5311' })
