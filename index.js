const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { sendMail } = require("./services/mailServices");
const { formatDate } = require("./services/formatDate");
const multer = require("multer");
const xlsx = require("xlsx");

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/send-email", upload.single("file") ,(req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({error: "No file uploaded."});
    }

    // Read the uploaded Excel file
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    

    // Convert sheet to JSON
    const data = xlsx.utils.sheet_to_json(worksheet);

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
