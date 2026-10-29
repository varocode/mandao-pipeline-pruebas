// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  // Tres salidas: consola, reporte HTML navegable y JUnit (XML) para el resumen del pipeline
  reporter: [["list"], ["html", { outputFolder: "reportes/playwright", open: "never" }], ["junit", { outputFile: "reportes/e2e.xml" }]],
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  // Levanta la app antes de las pruebas y la apaga al terminar
  webServer: { command: "npm run servir", url: "http://localhost:4173", reuseExistingServer: !process.env.CI, stderr: "ignore" },
  projects: [
    { name: "escritorio", testMatch: /web\.spec\.js/, use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 768 } } },
    { name: "movil-pixel7", testMatch: /movil\.spec\.js/, use: { ...devices["Pixel 7"] } },
  ],
});
