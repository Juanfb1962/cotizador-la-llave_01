// Edita este número y los productos para actualizar el destino y los precios.
const NUMERO_WHATSAPP = "51948310837";

// Lista única de productos: precio en soles, rendimiento y reglas de inclusión.
const PRODUCTOS = [
  // 1 galón cubre 4 m²; se redondea la cantidad hacia arriba.
  { nombre: "Impermeabilizante para techos", presentacion: "galón", precio: 65, rendimiento: 4, unidadCalculo: "m2", techos: ["concreto", "calamina"] },
  // 1 tubo alcanza para 15 m²; se redondea la cantidad hacia arriba.
  { nombre: "Sellador para grietas", presentacion: "tubo", precio: 18, rendimiento: 15, unidadCalculo: "m2", techos: ["concreto", "calamina"] },
  // Cada tramo cubre 3 metros lineales; solo aparece si se ingresan metros.
  { nombre: "Canaleta de PVC", presentacion: "tramo de 3 m", precio: 32, rendimiento: 3, unidadCalculo: "metros", techos: ["concreto", "calamina"], opcional: true },
  // Solo para calamina: 1 rollo de 10 m cada 20 m².
  { nombre: "Cinta de refuerzo", presentacion: "rollo de 10 m", precio: 28, rendimiento: 20, unidadCalculo: "m2", techos: ["calamina"] }
];

// Controles y zonas donde aparece la cotización.
const formulario = document.querySelector("#formulario-cotizacion");
const campoArea = document.querySelector("#area-techo");
const campoCanaleta = document.querySelector("#metros-canaleta");
const mensajeError = document.querySelector("#error-area");
const resultado = document.querySelector("#resultado");
const detalleTecho = document.querySelector("#detalle-techo");
const filasProductos = document.querySelector("#filas-productos");
const totalCotizacion = document.querySelector("#total-cotizacion");
const enlaceWhatsapp = document.querySelector("#enlace-whatsapp");

// Acepta decimales con punto o coma.
function leerNumero(valor) {
  const limpio = valor.trim().replace(/\s/g, "").replace(",", ".");
  if (!limpio || !/^\d+(\.\d+)?$/.test(limpio)) return NaN;
  return Number(limpio);
}

// Presenta los importes con dos decimales y el símbolo de soles.
function formatoSoles(monto) {
  return `S/ ${monto.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Selecciona productos válidos y redondea cada cantidad hacia arriba.
function calcularProductos(area, tipoTecho, metrosCanaleta) {
  return PRODUCTOS.filter((producto) => producto.techos.includes(tipoTecho))
    .filter((producto) => !producto.opcional || metrosCanaleta > 0)
    .map((producto) => {
      const base = producto.unidadCalculo === "metros" ? metrosCanaleta : area;
      const cantidad = Math.ceil(base / producto.rendimiento);
      return { ...producto, cantidad, subtotal: cantidad * producto.precio };
    });
}

// Agrega los productos calculados a la tabla de resultados.
function mostrarProductos(productos) {
  filasProductos.replaceChildren();
  productos.forEach((producto) => {
    const fila = document.createElement("tr");
    const nombre = document.createElement("td");
    nombre.textContent = `${producto.nombre} (${producto.presentacion})`;
    const cantidad = document.createElement("td");
    const indicador = document.createElement("span");
    indicador.className = "cantidad";
    indicador.textContent = String(producto.cantidad);
    cantidad.append(indicador);
    const precio = document.createElement("td");
    precio.textContent = formatoSoles(producto.precio);
    const subtotal = document.createElement("td");
    subtotal.textContent = formatoSoles(producto.subtotal);
    fila.append(nombre, cantidad, precio, subtotal);
    filasProductos.append(fila);
  });
}

// Prepara un pedido con el área, el techo, los productos y el total.
function prepararWhatsapp(area, tipoTecho, productos, total) {
  const nombreTecho = tipoTecho === "concreto" ? "Concreto" : "Calamina";
  const lista = productos.map((producto) => `- ${producto.nombre} (${producto.presentacion}): ${producto.cantidad}`).join("\n");
  const mensaje = [
    "Hola Jorge, quiero mi Kit anti lluvias:",
    `- Techo: ${area} m², ${nombreTecho}`,
    "- Productos:",
    lista,
    `- Total referencial: ${formatoSoles(total)}`
  ].join("\n");
  enlaceWhatsapp.href = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}

// Valida los metros y presenta el resumen de la cotización.
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const area = leerNumero(campoArea.value);
  if (!Number.isFinite(area) || area <= 0) {
    mensajeError.hidden = false;
    campoArea.setAttribute("aria-invalid", "true");
    resultado.hidden = true;
    campoArea.focus();
    return;
  }

  mensajeError.hidden = true;
  campoArea.removeAttribute("aria-invalid");
  const tipoTecho = formulario.elements["tipo-techo"].value;
  const entradaCanaleta = campoCanaleta.value.trim();
  const metrosCanaleta = entradaCanaleta ? leerNumero(entradaCanaleta) : 0;
  const canaletaValida = Number.isFinite(metrosCanaleta) && metrosCanaleta > 0 ? metrosCanaleta : 0;
  const productos = calcularProductos(area, tipoTecho, canaletaValida);
  const total = productos.reduce((suma, producto) => suma + producto.subtotal, 0);

  mostrarProductos(productos);
  detalleTecho.textContent = `${area} m² · Techo de ${tipoTecho}`;
  totalCotizacion.textContent = formatoSoles(total);
  prepararWhatsapp(area, tipoTecho, productos, total);
  resultado.hidden = false;
  resultado.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Retira el mensaje de error al empezar a corregir el área.
campoArea.addEventListener("input", () => {
  if (!mensajeError.hidden) {
    mensajeError.hidden = true;
    campoArea.removeAttribute("aria-invalid");
  }
});
