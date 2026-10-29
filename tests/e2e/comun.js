async function iniciarSesion(page, clave = "Mandao2026") {
  await page.goto("/#/login");
  await page.getByTestId("correo").fill("cliente@mandao.do");
  await page.getByTestId("clave").fill(clave);
  await page.getByTestId("entrar").click();
}

module.exports = { iniciarSesion };
