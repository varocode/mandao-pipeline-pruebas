const { test, expect } = require("@playwright/test");
const { iniciarSesion } = require("./comun");

test("E1 login válido muestra el catálogo", async ({ page }) => {
  await iniciarSesion(page);
  await expect(page.getByTestId("lista-productos").locator("li")).toHaveCount(6);
});

test("E2 login inválido muestra error", async ({ page }) => {
  await iniciarSesion(page, "incorrecta");
  await expect(page.getByTestId("error-login")).toContainText("incorrectos");
});

test("E3 carrito calcula el ITBIS", async ({ page }) => {
  await iniciarSesion(page);
  await page.getByTestId("agregar-arroz").click();
  await page.getByTestId("agregar-cafe").click();
  await expect(page.getByTestId("contador-carrito")).toHaveText("2");
  await page.getByTestId("nav-carrito").click();
  await expect(page.getByTestId("subtotal")).toHaveText("RD$ 785.00");
  await expect(page.getByTestId("itbis")).toHaveText("RD$ 141.30");
  await expect(page.getByTestId("total")).toHaveText("RD$ 926.30");
});

test("E4 producto agotado no se puede agregar", async ({ page }) => {
  await iniciarSesion(page);
  const boton = page.getByTestId("agregar-leche");
  await expect(boton).toBeDisabled();
  await expect(boton).toHaveText("Agotado");
});

test("E5 checkout valida el teléfono y confirma", async ({ page }) => {
  await iniciarSesion(page);
  await page.getByTestId("agregar-salami").click();
  await page.getByTestId("nav-carrito").click();
  await page.getByTestId("ir-a-pagar").click();
  await page.getByTestId("direccion").fill("Calle El Conde 101, Santo Domingo");
  await page.getByTestId("telefono").fill("123");
  await page.getByTestId("confirmar").click();
  await expect(page.getByTestId("error-pago")).toBeVisible();
  await page.getByTestId("telefono").fill("809-555-0123");
  await page.getByTestId("confirmar").click();
  await expect(page.getByTestId("numero-pedido")).toHaveText(/^MD-\d{6}$/);
});
