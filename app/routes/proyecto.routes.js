module.exports = app => {
    const proyectos = require("../controllers/proyecto.controller.js");

    var router = require("express").Router();

    // Retrieve all proyectos
    router.get("/", proyectos.findAll);

    // Retrieve all proyectos from one user
    router.get("/:administrador", proyectos.administrador);

    // Retrieve one proyecto
    router.get("/:administrador/:id", proyectos.findOne);

    // Create one proyecto
    router.post("/:administrador", proyectos.create)

    // Update a proyecto
    router.put("/:administrador/:id", proyectos.update);

    // Delete a proyecto
    router.delete("/:administrador/:id", proyectos.deleteOne);

    app.use('/api/proyectos', router);

}