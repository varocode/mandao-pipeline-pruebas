// Lógica de negocio pura de Mandao: sin DOM, para poder probarla con pruebas unitarias.
// Funciona en el navegador (window.Calculos) y en Node (require).

const ITBIS = 0.18;

function calcularTotales(carrito, productos, tasa = ITBIS) {
  const subtotal = Object.entries(carrito).reduce((suma, [id, cantidad]) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto) throw new Error(`Producto desconocido: ${id}`);
    return suma + producto.precio * cantidad;
  }, 0);
  const itbis = Math.round(subtotal * tasa * 100) / 100;
  return { subtotal, itbis, total: subtotal + itbis };
}

function telefonoValido(telefono) {
  return /^8[024]9-?\d{3}-?\d{4}$/.test(String(telefono).trim());
}

const Calculos = { ITBIS, calcularTotales, telefonoValido };
if (typeof module !== "undefined") module.exports = Calculos;
else window.Calculos = Calculos;
