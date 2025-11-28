function rowToEmailPayload(row) {
  const correoRaw = row["CORREO ELECTRONICO"];
  const addressRaw = row["DOMICILIO COMPLETO"];
  return {
    email: correoRaw?.text ?? correoRaw ?? null,
    date: null,
    folio: row["FOLIO"] ?? null,
    application: row["SOLICITUD"] ?? null,
    name: row["RAZÓN SOCIAL"] ?? null,
    address: addressRaw?.result ?? addressRaw ?? null,
    opinion: 'Favorable',
    id: row["ID COBRO"] ?? null,
  };
}

module.exports = { rowToEmailPayload };
