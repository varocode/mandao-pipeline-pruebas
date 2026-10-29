# Mandao · pipeline de pruebas automatizadas

[![Pipeline de pruebas](https://github.com/varocode/mandao-pipeline-pruebas/actions/workflows/pruebas.yml/badge.svg)](https://github.com/varocode/mandao-pipeline-pruebas/actions/workflows/pruebas.yml)

Pipeline de CI/CD con **GitHub Actions** para *Mandao*, una aplicación web de demostración (pedidos del súper a domicilio).
Es la Actividad 2 de la Unidad 5 de Calidad de Software (ISW-501), UNICARIBE.

## Etapas

| # | Etapa | Qué hace |
|---|---|---|
| 1 | Clonar | `actions/checkout` descarga el commit que disparó el pipeline |
| 2 | Dependencias | Node.js LTS con caché de npm, `npm ci` y Chromium de Playwright |
| 3 | Pruebas unitarias | `node:test` sobre la lógica de negocio (`app/calculos.js`): totales, ITBIS y teléfonos |
| 4 | Pruebas end-to-end | Playwright en escritorio y en un Pixel 7 emulado, contra la app servida en el runner |
| 5 | Reportes | Tabla en el resumen del job y artefacto `reportes` con HTML de Playwright y JUnit XML |
| 6 | Notificación | Si falla, abre un issue asignado al autor del commit; si vuelve a pasar, lo cierra |

## Correr en local

```bash
npm ci
npx playwright install chromium
npm run test:unit
npm run test:e2e
npm run resumen
```

Usuario de prueba de la app: `cliente@mandao.do` / `Mandao2026`.
