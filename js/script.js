/* ============================================================
    COLORFLY STUDIO — Lógica funcional (JavaScript vanilla)
    ============================================================
    Módulos:
    1. Estado
    2. Generación de color / conversión de formatos
    3. Render de la paleta
    4. Bloqueo de colores
    5. Copiado al portapapeles + toast
    6. Guardado / eliminación de paletas (localStorage)
    7. Inicialización y listeners
   ============================================================ */

/* ------------------------------------------------------------
    1. ESTADO
   ------------------------------------------------------------ */
const STORAGE_KEY = "colorfly_paletas";

const state = {
  colores: [], // [{ h, s, l, locked }]
  count: 9, // 6 | 8 | 9
  formato: "hsl", // 'hsl' | 'hex' | 'rgba'
};

/* ------------------------------------------------------------
    2. GENERACIÓN DE COLOR / CONVERSIÓN DE FORMATOS
   ------------------------------------------------------------ */
function generarColorAleatorio() {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 36) + 50; // 50% - 85%
  const l = Math.floor(Math.random() * 36) + 35; // 35% - 70%
  return { h, s, l };
}

// Conversión HSL -> RGB (0-255)
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
    Math.round(f(0) * 255),
    Math.round(f(8) * 255),
    Math.round(f(4) * 255),
  ];
}

function rgbToHex(r, g, b) {
  return (
    "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
  ).toUpperCase();
}

function getHex(color) {
  const [r, g, b] = hslToRgb(color.h, color.s, color.l);
  return rgbToHex(r, g, b);
}

function formatColor(color, formato) {
  const { h, s, l } = color;
  switch (formato) {
    case "hex":
      return getHex(color);
    case "rgba": {
      const [r, g, b] = hslToRgb(h, s, l);
      return `rgba(${r}, ${g}, ${b}, 1)`;
    }
    case "hsl":
    default:
      return `hsl(${h}, ${s}%, ${l}%)`;
  }
}

/* ------------------------------------------------------------
   3. RENDER DE LA PALETA
   ------------------------------------------------------------ */
function renderPaleta() {
  const grid = document.getElementById("grid-colores");
  if (!grid) return;

  grid.innerHTML = "";

  state.colores.forEach((color, index) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "Tarjeta-color";
    tarjeta.dataset.index = String(index);

    const circulo = document.createElement("div");
    circulo.style.backgroundColor = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
    if (color.locked) circulo.classList.add("bloqueado");
    circulo.addEventListener("click", () => copiarHex(index));

    const lockBtn = document.createElement("button");
    lockBtn.type = "button";
    lockBtn.className = "rombo-lock";
    lockBtn.setAttribute(
      "aria-label",
      color.locked ? "Desbloquear color" : "Bloquear color",
    );
    lockBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // evita que también dispare la copia al portapapeles
      toggleBloqueo(index);
    });
    circulo.appendChild(lockBtn);

    const texto = document.createElement("p");
    texto.textContent = formatColor(color, state.formato);

    tarjeta.appendChild(circulo);
    tarjeta.appendChild(texto);
    grid.appendChild(tarjeta);
  });
}

/* ------------------------------------------------------------
   4. BLOQUEO DE COLORES
   ------------------------------------------------------------ */
function toggleBloqueo(index) {
  const color = state.colores[index];
  if (!color) return;
  color.locked = !color.locked;
  renderPaleta();
}

function generarPaleta() {
  state.colores = state.colores.map((color) =>
    color.locked ? color : { ...generarColorAleatorio(), locked: false },
  );
  renderPaleta();
}

function ajustarCantidad(nuevoCount) {
  const actual = state.colores;

  if (nuevoCount > actual.length) {
    const diff = nuevoCount - actual.length;
    for (let i = 0; i < diff; i++) {
      actual.push({ ...generarColorAleatorio(), locked: false });
    }
  } else if (nuevoCount < actual.length) {
    // Al reducir, se eliminan primero los colores NO bloqueados desde el final
    while (actual.length > nuevoCount) {
      let idx = -1;
      for (let i = actual.length - 1; i >= 0; i--) {
        if (!actual[i].locked) {
          idx = i;
          break;
        }
      }
      if (idx === -1) idx = actual.length - 1; // si todos están bloqueados, se elimina el último igual
      actual.splice(idx, 1);
    }
  }

  state.count = nuevoCount;
}

/* ------------------------------------------------------------
   5. COPIADO AL PORTAPAPELES + TOAST
   ------------------------------------------------------------ */
let toastTimeout;

function mostrarToast(mensaje) {
  let toast = document.getElementById("toast-copiado");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-copiado";
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "24px",
      left: "50%",
      transform: "translateX(-50%) translateY(20px)",
      background: "#101d33",
      color: "#fff",
      border: "2px solid rgb(10, 198, 255)",
      borderRadius: "999px",
      padding: "10px 20px",
      fontSize: "0.8rem",
      letterSpacing: "1px",
      textTransform: "uppercase",
      fontWeight: "700",
      opacity: "0",
      transition: "opacity 0.25s ease, transform 0.25s ease",
      zIndex: "9999",
      pointerEvents: "none",
    });
    document.body.appendChild(toast);
  }

  toast.textContent = mensaje;
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
  }, 1800);
}

function copiarConFallback(texto) {
  const textarea = document.createElement("textarea");
  textarea.value = texto;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("No se pudo copiar el color:", err);
  }
  document.body.removeChild(textarea);
  mostrarToast(`${texto} copiado`);
}

function copiarHex(index) {
  const color = state.colores[index];
  if (!color) return;
  const hex = getHex(color);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(hex)
      .then(() => mostrarToast(`${hex} copiado`))
      .catch(() => copiarConFallback(hex));
  } else {
    copiarConFallback(hex);
  }
}

/* ------------------------------------------------------------
   6. GUARDADO / ELIMINACIÓN DE PALETAS (localStorage)
   ------------------------------------------------------------ */
function obtenerPaletasGuardadas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("No se pudieron leer las paletas guardadas:", err);
    return [];
  }
}

function guardarPaletasGuardadas(paletas) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(paletas));
  } catch (err) {
    console.error("No se pudieron guardar las paletas:", err);
  }
}

function guardarPaleta() {
  const paletas = obtenerPaletasGuardadas();
  const nuevaPaleta = {
    id: Date.now().toString(),
    colores: state.colores.map((c) => ({ h: c.h, s: c.s, l: c.l })),
  };
  paletas.unshift(nuevaPaleta);
  guardarPaletasGuardadas(paletas);
  renderPaletasGuardadas();
}

function eliminarPaleta(id) {
  const paletas = obtenerPaletasGuardadas().filter((p) => p.id !== id);
  guardarPaletasGuardadas(paletas);
  renderPaletasGuardadas();
}

function renderPaletasGuardadas() {
  const contenedor = document.getElementById("paletas-guardadas");
  if (!contenedor) return;

  // Se eliminan solo las tarjetas previas, se conserva el <h3> existente
  contenedor
    .querySelectorAll(".paleta-guardada-wrapper")
    .forEach((el) => el.remove());

  const paletas = obtenerPaletasGuardadas();

  paletas.forEach((paleta) => {
    const wrapper = document.createElement("div");
    wrapper.className = "paleta-guardada-wrapper";

    const grid = document.createElement("div");
    grid.className = "paleta-guardada";
    paleta.colores.forEach((c) => {
      const span = document.createElement("span");
      span.className = "color-guardado";
      span.style.backgroundColor = `hsl(${c.h}, ${c.s}%, ${c.l}%)`;
      grid.appendChild(span);
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn-eliminar-paleta";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => eliminarPaleta(paleta.id));

    wrapper.appendChild(grid);
    wrapper.appendChild(btnEliminar);
    contenedor.appendChild(wrapper);
  });
}

/* ------------------------------------------------------------
   7. INICIALIZACIÓN Y LISTENERS
   ------------------------------------------------------------ */
function attachEventListeners() {
  const selectFormato = document.getElementById("formato-color");
  const contenedorCantidad = document.getElementById("cantidad-colores");
  const btnGenerar = document.getElementById("btn-generar");
  const btnGuardar = document.getElementById("btn-guardar");

  if (selectFormato) {
    selectFormato.value = state.formato;
    selectFormato.addEventListener("change", (e) => {
      state.formato = e.target.value.toLowerCase();
      renderPaleta();
    });
  }

  if (contenedorCantidad) {
    const botones = Array.from(contenedorCantidad.querySelectorAll("button"));
    botones.forEach((btn) => {
      const n = parseInt(btn.dataset.count, 10);
      if (n === state.count) btn.classList.add("active");

      btn.addEventListener("click", () => {
        botones.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        ajustarCantidad(n);
        renderPaleta();
      });
    });
  }

  if (btnGenerar) {
    btnGenerar.addEventListener("click", generarPaleta);
  }

  if (btnGuardar) {
    btnGuardar.addEventListener("click", guardarPaleta);
  }
}

function init() {
  state.colores = Array.from({ length: state.count }, () => ({
    ...generarColorAleatorio(),
    locked: false,
  }));

  renderPaleta();
  renderPaletasGuardadas();
  attachEventListeners();
}

document.addEventListener("DOMContentLoaded", init);
