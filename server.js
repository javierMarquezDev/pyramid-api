const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const db = require("./app/models");
db.sequelize.sync();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to pyramid." });
});

require("./app/routes/usuario.routes")(app);
require("./app/routes/empresa.routes")(app);
require("./app/routes/archivo.routes")(app);
require("./app/routes/encuesta.routes")(app);
require("./app/routes/encuestausuario.routes")(app);
require("./app/routes/grupo.routes")(app);
require("./app/routes/mensaje.routes")(app);
require("./app/routes/noticia.routes")(app);
require("./app/routes/pregunta.routes")(app);
require("./app/routes/proyectousuario.routes")(app);
require("./app/routes/proyecto.routes")(app);
require("./app/routes/rol.routes")(app);
require("./app/routes/rolusuario.routes")(app);
require("./app/routes/sesion.routes")(app);
require("./app/routes/tarea.routes")(app);
require("./app/routes/telefono.routes")(app);
require("./app/routes/usuariogrupo.routes")(app);
require("./app/routes/usuariotarea.routes")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});