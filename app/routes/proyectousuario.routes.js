module.exports = app => {
    const proyectousuarios = require("../controllers/proyectousuario.controller.js");

    var router = require("express").Router();

    // Retrieve all proyectousuarios
    router.get("/", proyectousuarios.findAll);

    // Retrieve one proyectousuario
    router.get("/:usuario/:proyectoadministrador/:proyectocodigo", proyectousuarios.findOne);

    // Retrieve by usuario
    router.get("/:usuario", proyectousuarios.usuario);

    // Retrieve by proyecto
    router.get("/:proyectoadministrador/:proyectocodigo", proyectousuarios.proyecto);

    // Create one proyectousuario
    router.post("/:proyectoadministrador/:proyectocodigo", proyectousuarios.create)

    // Update a proyectousuario
    router.put("/:usuario/:proyectoadministrador/:proyectocodigo", proyectousuarios.update);

    // Delete a proyectousuario
    router.delete("/:usuario/:proyectoadministrador/:proyectocodigo", proyectousuarios.deleteOne);

    app.use('/api/proyectousuarios', router);

}