let fechaActual;

const inputFecha = document.getElementById("input-fecha");

// Usa formato local compatible con input type="date"
const fechaLocal = new Date().toLocaleDateString("en-CA");

inputFecha.value = fechaLocal;
fechaActual = fechaLocal;

function calcularAsistencias(estudiante) {
  return Object.values(estudiante.registros)
    .filter(valor => valor === true)
    .length;
}

let estudiantes = [];

async function cargarEstudiantes() {
  try {
    const datosGuardados = localStorage.getItem("estudiantes");

    if (datosGuardados) {
      estudiantes = JSON.parse(datosGuardados);
    } else {
      const response = await fetch("estudiantes.json");
      estudiantes = await response.json();
      localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
    }

    estudiantes.sort((a, b) =>
      a.apellidos.localeCompare(b.apellidos)
    );

    iniciarApp(); // SOLO cuando ya cargó todo
  } catch (error) {
    console.error("Error cargando estudiantes:", error);
  }
}

function iniciarApp() {
  mostrarTabla();
}

const enlaces = document.querySelectorAll(".pestanas a");

enlaces.forEach(enlace => {
  const archivoActual = window.location.pathname.split("/").pop();

  if (enlace.getAttribute("href") === archivoActual) {
    enlace.classList.add("activo");
  }
});

const contenedor = document.getElementById("contenedorTabla");

const tabla = document.createElement("table");

tabla.classList.add("tabla-estudiantes");

contenedor.appendChild(tabla);

const thead = document.createElement("thead");
tabla.appendChild(thead);

const tbody = document.createElement("tbody");
tabla.appendChild(tbody);

const filaEncabezados = document.createElement("tr");
thead.appendChild(filaEncabezados);

const encabezados = ["Foto", "Nombre", "Pasaje de lista", "Asistencias", "Primera reunión", "Juicio de la primera reunión", "Segunda reunión", "Juicio de la segunda reunión"];

encabezados.forEach((encabezado, index) => {
  const celda = document.createElement("th");
  celda.textContent = encabezado;

  if (index === 2) {
    celda.classList.add("col-lista");
  }

  if (index >= 4) {
    celda.classList.add("col-reunion");
  }

  filaEncabezados.appendChild(celda);
});

function agregarCelda(fila, texto, indiceColumna) {
  const celda = document.createElement("td");
  celda.textContent = texto;

  // Columna 3 → Pasaje de lista
  if (indiceColumna === 2) {
    celda.classList.add("col-lista");
  }

  // Columna 4 en adelante → Reuniones
  if (indiceColumna >= 4) {
    celda.classList.add("col-reunion");
  }

  fila.appendChild(celda);
}

estudiantes.forEach((estudiante, index) => {
  estudiante.index = index; // Agregar el índice al objeto estudiante
});

function agregarImagen(fila, ruta) {
  const celda = document.createElement("td");

  const imagen = document.createElement("img");
  imagen.src = ruta;

  imagen.classList.add("foto-estudiante"); // 👈 importante

  celda.appendChild(imagen);
  fila.appendChild(celda);


}

function mostrarTabla() {

  tbody.innerHTML = ""; // limpiar por si se vuelve a renderizar

  estudiantes.forEach((estudiante, index) => {

    const fila = document.createElement("tr");

    const numero = String(index + 1).padStart(2, "0");

    agregarImagen(fila, estudiante.foto);
    agregarCelda(fila, `${numero} - ${estudiante.apellidos}, ${estudiante.nombres}`, 1);

    const celdaLista = document.createElement("td");
    celdaLista.classList.add("col-lista");

    const estado = document.createElement("span");
    estado.classList.add("estado-asistencia");

    celdaLista.appendChild(estado);
    fila.appendChild(celdaLista);

    agregarCelda(fila, calcularAsistencias(estudiante), 3);
    agregarCelda(fila, estudiante.primeraReunion, 4);

    const celdaJuicioPrimera = document.createElement("td");

    celdaJuicioPrimera.textContent = estudiante.juicioPrimera;
    celdaJuicioPrimera.contentEditable = true;
    celdaJuicioPrimera.classList.add("editable");

    celdaJuicioPrimera.addEventListener("blur", () => {
      estudiante.juicioPrimera = celdaJuicioPrimera.textContent;
      localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
    });

    fila.appendChild(celdaJuicioPrimera);

    agregarCelda(fila, estudiante.segundaReunion, 6);

    const celdaJuicioSegunda = document.createElement("td");

    celdaJuicioSegunda.textContent = estudiante.juicioPrimera;
    celdaJuicioSegunda.contentEditable = true;
    celdaJuicioSegunda.classList.add("editable");

    celdaJuicioSegunda.addEventListener("blur", () => {
      estudiante.juicioPrimera = celdaJuicioSegunda.textContent;
      localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
    });

    fila.appendChild(celdaJuicioSegunda);

    tbody.appendChild(fila);

    // Si ya existe registro en esa fecha, marcarlo
    let asistio = estudiante.registros[fechaActual] === true;

    estado.textContent = asistio ? "✔" : "✖";
    estado.title = asistio ? "Asistió" : "No asistió";
    estado.classList.add(asistio ? "asistio" : "no-asistio");

    estado.addEventListener("click", () => {

      asistio = !asistio;

      estudiante.registros[fechaActual] = asistio;

      estado.textContent = asistio ? "✔" : "✖";
      estado.title = asistio ? "Asistió" : "No asistió";

      estado.classList.toggle("asistio");
      estado.classList.toggle("no-asistio");

    });
  });
}

function formatearFecha(fechaString) {
  // Separar manualmente año, mes y día
  const [anio, mes, dia] = fechaString.split("-");

  // Crear fecha en horario local
  const fecha = new Date(anio, mes - 1, dia);

  const opciones = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  let partes = fecha
    .toLocaleDateString("es-ES", opciones)
    .replace(",", "")
    .split(" ");

  // Capitalizar día
  partes[0] = partes[0].charAt(0).toUpperCase() + partes[0].slice(1);

  // Capitalizar mes
  const ultimoIndice = partes.length - 1;
  partes[ultimoIndice] =
    partes[ultimoIndice].charAt(0).toUpperCase() +
    partes[ultimoIndice].slice(1);

  return partes.join(" ");
}

cargarEstudiantes();

const boton = document.getElementById("btn-lista");

boton.addEventListener("click", () => {
  tabla.classList.toggle("modo-lista");
  panelLista.classList.toggle("visible");

  if (document.querySelector("table").classList.contains("modo-lista")) {
    boton.textContent = "Ver reuniones";
  } else {
    boton.textContent = "Pasaje de Lista";
  }
});

function actualizarEncabezadoFecha() {
  filaEncabezados.children[2].textContent =
    `Pasaje de lista (${formatearFecha(fechaActual)})`;
}

document.addEventListener("DOMContentLoaded", () => {
  fechaActual = inputFecha.value;
  actualizarEncabezadoFecha();
  mostrarTabla();
});

inputFecha.addEventListener("change", () => {
  fechaActual = inputFecha.value;
  actualizarEncabezadoFecha();
  mostrarTabla();
});

const btnGuardar = document.getElementById("btn-guardar");

btnGuardar.addEventListener("click", () => {
  localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
  mostrarTabla();
});

const panelLista = document.getElementById("panel-lista");

function guardarAsistencia(btnGuardar) {
  const contenidoOriginal = btnGuardar.innerHTML;

  btnGuardar.innerHTML = "Asistencias actualizadas ✓";
  btnGuardar.style.backgroundColor = "rgba(0, 161, 0, 0.45)";
  btnGuardar.style.fontWeight = "bolder";
  btnGuardar.style.transform = "scale(1.05)";
  btnGuardar.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";

  setTimeout(() => {
    btnGuardar.innerHTML = "Guardar asistencia";
    btnGuardar.style.backgroundColor = "rgba(255,255,255,0.15)";
    btnGuardar.style.transform = "scale(1)";
    btnGuardar.style.boxShadow = "none";
  }, 3000);
}