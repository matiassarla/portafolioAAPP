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

const encabezados = ["Foto", "Nombre", "Asistencias", "Primera reunión", "Juicio de la primera reunión", "Segunda reunión", "Juicio de la segunda reunión"];

encabezados.forEach(encabezado => {
  const celda = document.createElement("th");
  celda.textContent = encabezado;
  filaEncabezados.appendChild(celda);
});

function agregarCelda(fila, texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
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
    agregarCelda(fila, `${numero} - ${estudiante.apellidos}, ${estudiante.nombres}`);
    agregarCelda(fila, estudiante.asistencias);
    agregarCelda(fila, estudiante.primeraReunion);
    agregarCelda(fila, estudiante.juicioPrimera);
    agregarCelda(fila, estudiante.segundaReunion);
    agregarCelda(fila, estudiante.juicioSegunda);

    tbody.appendChild(fila);
  });
}

cargarEstudiantes();