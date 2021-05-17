module.exports = app => {
    const rolusuarios = require("../controllers/rolusuario.controller.js");

    var router = require("express").Router();

    // Retrieve all rolusuarios
    router.get("/", rolusuarios.findAll);

    // Retrieve one rolusuario
    router.get("/:id", rolusuarios.findOne);

    // Update a rolusuario
    router.put("/:id", rolusuarios.update);

    // Delete a rolusuario
    router.delete("/:id", rolusuarios.deleteOne);

    app.use('/api/rolusuarios', router);

}