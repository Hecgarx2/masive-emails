const ExcelJS = require("exceljs");

async function readExcelFile(buffer) {
  // Read the uploaded Excel file
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  // Get the first sheet
  const worksheet = workbook.worksheets[0];

  // Convert sheet to JSON
  const data = [];

  const headers = [];
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headers[colNumber] = cell.value;
  });

  // Recorrer filas restantes
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Saltar encabezados

    const rowData = {};
    row.eachCell((cell, colNumber) => {
      rowData[headers[colNumber]] = cell.value;
    });

    data.push(rowData);
  });

  return data;
}


module.exports = { readExcelFile }