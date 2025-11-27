function rowToEmailPayload(row) {
  return {
    date: row["FECHA"],
    folio: row["FOLIO"],
    application: row["APPLICATION"],
    name: row["NOMBRE"],
    address: row["DIRECCION"],
    opinion: row["OPINION"],
    id: row["ID"],
  };
}

module.exports = rowToEmailPayload;
