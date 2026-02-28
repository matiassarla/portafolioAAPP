let estudiantes = [];

async function cargarEstudiantes() {
  try {
    const response = await fetch("estudiantes.json");
    estudiantes = await response.json();

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

const encabezados = ["Foto", "Nombre", "Asistencias", "Pasaje de lista", "Primera reunión", "Juicio de la primera reunión", "Segunda reunión", "Juicio de la segunda reunión"];

encabezados.forEach((encabezado, index) => {
  const celda = document.createElement("th");
  celda.textContent = encabezado;

  if (index === 3) {
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
  if (indiceColumna === 3) {
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
    agregarCelda(fila, estudiante.asistencias, 2);
    agregarCelda(fila, "", 3); // 👈 Pasaje de lista (vacío por defecto)
    agregarCelda(fila, estudiante.primeraReunion, 4);
    agregarCelda(fila, estudiante.juicioPrimera, 5);
    agregarCelda(fila, estudiante.segundaReunion, 6);
    agregarCelda(fila, estudiante.juicioSegunda, 7);

    tbody.appendChild(fila);
  });
}

cargarEstudiantes();

const boton = document.getElementById("btn-lista");

boton.addEventListener("click", () => {
  document.querySelector("table").classList.toggle("modo-lista");

  if (document.querySelector("table").classList.contains("modo-lista")) {
    boton.textContent = "Ver reuniones";
  } else {
    boton.textContent = "Pasaje de Lista";
  }
});