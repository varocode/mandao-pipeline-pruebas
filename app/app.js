// Mandao: aplicación de demostración para el estudio de caso del trabajo final.
// Es una SPA sin dependencias. El catálogo se carga con un retraso artificial
// para simular la red y obligar a las herramientas a esperar bien.

const RETRASO_CATALOGO_MS = 900;
const USUARIO = { correo: "cliente@mandao.do", clave: "Mandao2026" };

const estado = {
  get sesion() { return sessionStorage.getItem("sesion") === "1"; },
  set sesion(v) { v ? sessionStorage.setItem("sesion", "1") : sessionStorage.removeItem("sesion"); },
  get carrito() { return JSON.parse(sessionStorage.getItem("carrito") || "{}"); },
  set carrito(c) { sessionStorage.setItem("carrito", JSON.stringify(c)); actualizarContador(); },
};

const vista = document.getElementById("vista");
const rd = (n) => "RD$ " + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
let productos = [];

function actualizarContador() {
  const total = Object.values(estado.carrito).reduce((a, b) => a + b, 0);
  document.querySelector("[data-testid=contador-carrito]").textContent = total;
}

function login() {
  estado.sesion = false;
  vista.innerHTML = `
    <section class="tarjeta login">
      <h1>Inicia sesión</h1>
      <form data-testid="form-login" novalidate>
        <label>Correo <input type="email" name="correo" data-testid="correo" autocomplete="username"></label>
        <label>Contraseña <input type="password" name="clave" data-testid="clave" autocomplete="current-password"></label>
        <p class="error" data-testid="error-login" hidden>Correo o contraseña incorrectos.</p>
        <button type="submit" data-testid="entrar">Entrar</button>
      </form>
    </section>`;
  vista.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const datos = new FormData(e.target);
    if (datos.get("correo") === USUARIO.correo && datos.get("clave") === USUARIO.clave) {
      estado.sesion = true;
      location.hash = "#/catalogo";
    } else {
      vista.querySelector("[data-testid=error-login]").hidden = false;
    }
  });
}

async function catalogo() {
  vista.innerHTML = `<h1>Catálogo</h1><p class="cargando" data-testid="cargando">Cargando productos…</p>`;
  if (!productos.length) {
    const r = await fetch("productos.json");
    productos = await r.json();
    await new Promise((ok) => setTimeout(ok, RETRASO_CATALOGO_MS));
  }
  if (location.hash !== "#/catalogo") return;
  vista.innerHTML = `<h1>Catálogo</h1><ul class="grilla" data-testid="lista-productos">${productos.map((p) => `
    <li class="producto" data-testid="producto-${p.id}">
      <span class="nombre">${p.nombre}</span>
      <span class="precio">${rd(p.precio)}</span>
      ${p.disponible
        ? `<button data-testid="agregar-${p.id}" data-id="${p.id}">Agregar</button>`
        : `<button data-testid="agregar-${p.id}" disabled>Agotado</button>`}
    </li>`).join("")}</ul>`;
  vista.querySelectorAll("button[data-id]").forEach((b) => b.addEventListener("click", () => {
    const c = estado.carrito; c[b.dataset.id] = (c[b.dataset.id] || 0) + 1; estado.carrito = c;
  }));
}

function totales() {
  return Calculos.calcularTotales(estado.carrito, productos);
}

async function carrito() {
  if (!productos.length) productos = await (await fetch("productos.json")).json();
  const c = estado.carrito;
  if (!Object.keys(c).length) {
    vista.innerHTML = `<h1>Carrito</h1><p data-testid="carrito-vacio">Tu carrito está vacío.</p>`;
    return;
  }
  const t = totales();
  vista.innerHTML = `<h1>Carrito</h1>
    <table class="tabla" data-testid="tabla-carrito">${Object.entries(c).map(([id, n]) => {
      const p = productos.find((x) => x.id === id);
      return `<tr data-testid="linea-${id}"><td>${p.nombre}</td><td>× ${n}</td><td>${rd(p.precio * n)}</td></tr>`;
    }).join("")}</table>
    <dl class="totales">
      <dt>Subtotal</dt><dd data-testid="subtotal">${rd(t.subtotal)}</dd>
      <dt>ITBIS (18 %)</dt><dd data-testid="itbis">${rd(t.itbis)}</dd>
      <dt>Total</dt><dd data-testid="total">${rd(t.total)}</dd>
    </dl>
    <a class="boton" href="#/pago" data-testid="ir-a-pagar">Ir a pagar</a>`;
}

function pago() {
  vista.innerHTML = `
    <section class="tarjeta">
      <h1>Datos de entrega</h1>
      <form data-testid="form-pago" novalidate>
        <label>Dirección <input name="direccion" data-testid="direccion"></label>
        <label>Teléfono <input name="telefono" data-testid="telefono" placeholder="809-555-0123"></label>
        <p class="error" data-testid="error-pago" hidden>Completa la dirección y un teléfono válido (809, 829 u 849).</p>
        <button type="submit" data-testid="confirmar">Confirmar pedido</button>
      </form>
    </section>`;
  vista.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(e.target);
    const telValido = Calculos.telefonoValido(d.get("telefono"));
    if (!String(d.get("direccion")).trim() || !telValido) {
      vista.querySelector("[data-testid=error-pago]").hidden = false;
      return;
    }
    const pedido = "MD-" + String(Date.now()).slice(-6);
    sessionStorage.setItem("ultimoPedido", pedido);
    estado.carrito = {};
    location.hash = "#/confirmacion";
  });
}

function confirmacion() {
  vista.innerHTML = `<section class="tarjeta ok"><h1 data-testid="titulo-confirmacion">¡Pedido confirmado!</h1>
    <p>Tu número de pedido es <b data-testid="numero-pedido">${sessionStorage.getItem("ultimoPedido")}</b>.</p></section>`;
}

const rutas = { "#/login": login, "#/catalogo": catalogo, "#/carrito": carrito, "#/pago": pago, "#/confirmacion": confirmacion };

function enrutar() {
  const destino = location.hash || "#/login";
  if (destino !== "#/login" && !estado.sesion) { location.hash = "#/login"; return; }
  document.querySelector(".menu").classList.remove("abierto");
  (rutas[destino] || login)();
}

document.querySelector("[data-testid=menu-movil]").addEventListener("click", (e) => {
  const abierto = document.querySelector(".menu").classList.toggle("abierto");
  e.currentTarget.setAttribute("aria-expanded", String(abierto));
});

window.addEventListener("hashchange", enrutar);
actualizarContador();
enrutar();
