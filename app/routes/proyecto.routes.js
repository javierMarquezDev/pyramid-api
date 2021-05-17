module.exports = app => {
    const proyectos = require("../controllers/proyecto.controller.js");

    var router = require("express").Router();

    // Retrieve all proyectos
    router.get("/", proyectos.findAll);

    // Retrieve one proyecto
    router.get("/:id", proyectos.findOne);

    // Update a proyecto
    router.put("/:id", proyectos.update);

    // Delete a proyecto
    router.delete("/:id", proyectos.deleteOne);

    app.use('/api/proyectos', router);

}