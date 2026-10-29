const { test, expect } = require("@playwright/test");
const { iniciarSesion } = require("./comun");

test("M1 menú móvil", async ({ page }) => {
  await iniciarSesion(page);
  await expect(page.getByTestId("lista-productos")).toBeVisible();
  await expect(page.getByTestId("menu")).toBeHidden();
  await page.getByTestId("menu-movil").tap();
  await page.getByTestId("nav-carrito").tap();
  await expect(page.getByTestId("carrito-vacio")).toBeVisible();
});

test("M2 compra en móvil", async ({ page }) => {
  await iniciarSesion(page);
  await page.getByTestId("agregar-arroz").tap();
  await page.getByTestId("agregar-cafe").tap();
  await page.getByTestId("menu-movil").tap();
  await page.getByTestId("nav-carrito").tap();
  await expect(page.getByTestId("total")).toHaveText("RD$ 926.30");
});
