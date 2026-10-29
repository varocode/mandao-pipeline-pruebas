// Lee los reportes JUnit de las pruebas y escribe una tabla en Markdown.
// En GitHub Actions la agrega al resumen del job ($GITHUB_STEP_SUMMARY).
const fs = require("node:fs");

const suites = [
  ["Unitarias (node:test)", "reportes/unitarias.xml"],
  ["End-to-end (Playwright)", "reportes/e2e.xml"],
];

function contar(archivo) {
  if (!fs.existsSync(archivo)) return null;
  const xml = fs.readFileSync(archivo, "utf8");
  const casos = xml.match(/<testcase\b[\s\S]*?(?:\/>|<\/testcase>)/g) || [];
  const fallidas = casos.filter((c) => /<failure\b|<error\b/.test(c)).length;
  const omitidas = casos.filter((c) => /<skipped\b/.test(c)).length;
  return { total: casos.length, fallidas, omitidas, pasadas: casos.length - fallidas - omitidas };
}

let lineas = ["## Resultado de las pruebas", "", "| Suite | Pasaron | Fallaron | Total |", "|---|---:|---:|---:|"];
let hayFallos = false;
for (const [nombre, archivo] of suites) {
  const r = contar(archivo);
  if (!r) { lineas.push(`| ${nombre} | — | — | no se ejecutó |`); hayFallos = true; continue; }
  if (r.fallidas) hayFallos = true;
  lineas.push(`| ${nombre} | ${r.pasadas} | ${r.fallidas} | ${r.total} |`);
}
lineas.push("", hayFallos ? "❌ **Hay pruebas fallidas.** Descarga el artefacto `reportes` para ver el detalle." : "✅ **Todas las pruebas pasaron.**");

const md = lineas.join("\n") + "\n";
console.log(md);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
