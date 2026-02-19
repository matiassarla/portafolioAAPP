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

const estudiantes = [
    {foto: "images/juanPerez.jpg",
     nombres: "Juan",
     apellidos: "Pérez",
     asistencias: 5,
     primeraReunion: "Sí",
     juicioPrimera: "Bueno",
     segundaReunion: "No",
     juicioSegunda: "Regular"
    },

    {foto: "images/mariaGomez.jpg",
     nombres: "María",
     apellidos: "Gómez",
     asistencias: 4,
     primeraReunion: "No",
     juicioPrimera: "Regular",
     segundaReunion: "Sí",
     juicioSegunda: "Bueno"
    },

    {foto: "images/carlosRodriguez.jpg",
     nombres: "Carlos",
     apellidos: "Rodríguez",
     asistencias: 3,
     primeraReunion: "Sí",
     juicioPrimera: "Regular",
     segundaReunion: "Sí",
     juicioSegunda: "Regular"
    }
];

function agregarCelda(fila, texto) {
    const celda = document.createElement("td");
    celda.textContent = texto;
    fila.appendChild(celda);
}

estudiantes.sort((a, b) => 
    a.apellidos.localeCompare(b.apellidos)
);

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

estudiantes.forEach(estudiante => {
    const fila = document.createElement("tr");

    const numero = String(estudiante.index + 1).padStart(2, "0");
    
    agregarImagen(fila, estudiante.foto);
    agregarCelda(fila, `${numero} - ${estudiante.nombres} ${estudiante.apellidos}`);
    agregarCelda(fila, estudiante.asistencias);
    agregarCelda(fila, estudiante.primeraReunion);
    agregarCelda(fila, estudiante.juicioPrimera);
    agregarCelda(fila, estudiante.segundaReunion);
    agregarCelda(fila, estudiante.juicioSegunda);

    tbody.appendChild(fila);
    
});