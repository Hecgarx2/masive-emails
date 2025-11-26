const formatDate = () => {
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1; // Los meses empiezan en 0, por eso se suma 1
    const anio = fechaActual.getFullYear();

    // Asegurarse de que el día y mes tengan dos dígitos
    const diaConFormato = dia < 10 ? '0' + dia : dia;
    const mesConFormato = mes < 10 ? '0' + mes : mes;

    const fechaFormateada = `${diaConFormato}/${mesConFormato}/${anio}`;
    return fechaFormateada;
}


module.exports = { formatDate };