module.exports = app => {
    const rolusuarios = require("../controllers/rolusuario.controller.js");

    var router = require("express").Router();

    // Retrieve all rolusuarios
    router.get("/", rolusuarios.findAll);

    // Retrieve all usuarios by rol
    router.get("/:rol", rolusuarios.rol);

    // Retrieve all rols by usuario
    router.get("/:usuario", rolusuarios.usuario);

    // Retrieve one rolusuario
    router.get("/:rol/:usuario", rolusuarios.findOne);

    // Create one rolusuario
    router.post("/", rolusuarios.create)

    // Update a rolusuario
    router.put("/:rol/:usuario", rolusuarios.update);

    // Delete a rolusuario
    router.delete("/:rol/:usuario", rolusuarios.deleteOne);

    app.use('/api/rolusuarios', router);

}