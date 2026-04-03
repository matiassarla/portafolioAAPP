const cors = require("cors");
const express = require("express");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

// Obtener estudiantes
app.get("/estudiantes", (req, res) => {
  const data = fs.readFileSync("estudiantes.json", "utf-8");
  res.json(JSON.parse(data));
});

// Guardar estudiantes
app.post("/estudiantes", (req, res) => {
  fs.writeFileSync("estudiantes.json", JSON.stringify(req.body, null, 2));
  res.send("Datos guardados");
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});