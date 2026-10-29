// Pruebas unitarias de la lógica de negocio (node:test, sin dependencias externas).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { calcularTotales, telefonoValido } = require("../../app/calculos");
const productos = require("../../app/productos.json");

test("U1 subtotal, ITBIS y total de arroz + café", () => {
  const t = calcularTotales({ arroz: 1, cafe: 1 }, productos);
  assert.equal(t.subtotal, 785);
  assert.equal(t.itbis, 141.3);
  assert.equal(t.total, 926.3);
});

test("U2 un carrito vacío suma cero", () => {
  assert.deepEqual(calcularTotales({}, productos), { subtotal: 0, itbis: 0, total: 0 });
});

test("U3 multiplica por la cantidad de cada producto", () => {
  const t = calcularTotales({ habichuelas: 4 }, productos);
  assert.equal(t.subtotal, 300);
  assert.equal(t.itbis, 54);
});

test("U4 el ITBIS se redondea a dos decimales", () => {
  const t = calcularTotales({ platanos: 1 }, productos, 0.18333);
  assert.equal(t.itbis, 11);
});

test("U5 un producto inexistente lanza error", () => {
  assert.throws(() => calcularTotales({ yuca: 1 }, productos), /Producto desconocido/);
});

test("U6 acepta teléfonos con 809, 829 y 849", () => {
  for (const tel of ["809-555-0123", "8295550123", "849-555-0123"]) assert.ok(telefonoValido(tel), tel);
});

test("U7 rechaza otros prefijos y formatos", () => {
  for (const tel of ["808-555-0123", "809-55-0123", "", "abc"]) assert.ok(!telefonoValido(tel), tel);
});
