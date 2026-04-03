const cors = require("cors");
const express = require("express");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const path = require("path");
app.use(express.static(path.join(__dirname, "../")));

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});