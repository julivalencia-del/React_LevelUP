// validaciones.js
function validarRUT(rut) {
  return /^[0-9]{7,8}-[0-9kK]$/.test(rut);
}

function validarCorreo(correo) {
  return /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|duoc\.cl|profesor\.duoc\.cl)$/.test(correo);
}

function validarPassword(pass) {
  return pass.length >= 6 && pass.length <= 20;
}

function validarStock(stock) {
  return !isNaN(stock) && Number(stock) >= 0;
}

function validarPrecio(precio) {
  return !isNaN(precio) && Number(precio) > 0;
}

document.addEventListener("DOMContentLoaded", () => {
  // Validación completamente deshabilitada para evitar conflictos con app.js
  console.log('validaciones.js cargado, pero eventos deshabilitados para evitar conflictos');
});
