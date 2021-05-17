module.exports = app => {
    const proyectousuarios = require("../controllers/proyectousuario.controller.js");

    var router = require("express").Router();

    // Retrieve all proyectousuarios
    router.get("/", proyectousuarios.findAll);

    // Retrieve one proyectousuario
    router.get("/:id", proyectousuarios.findOne);

    // Update a proyectousuario
    router.put("/:id", proyectousuarios.update);

    // Delete a proyectousuario
    router.delete("/:id", proyectousuarios.deleteOne);

    app.use('/api/proyectousuarios', router);

}