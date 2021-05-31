module.exports = app => {
    const sesions = require("../controllers/sesion.controller.js");
    const sesionusuarios = require("../controllers/sesion.controller.js");

    var router = require("express").Router();

    // Retrieve all sesions
    router.get("/", sesions.findAll);

    //Retrieve sesiones by usuario
    router.get("/:usuario/timeline", sesionusuarios.usuario);

    // Retrieve one sesion
    router.get("/:usuario/:codigo", sesions.findOne);

    // Create one sesion
    router.post("/:usuario", sesions.create)

    // Update a sesion
    router.put("/:usuario/:codigo", sesions.update);

    // Delete a sesion
    router.delete("/:usuario/:codigo", sesions.deleteOne);

    app.use('/api/sesions', router);

}