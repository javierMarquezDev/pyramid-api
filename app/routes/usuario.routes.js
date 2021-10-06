module.exports = app => {
    const usuarios = require("../controllers/usuario.controller.js");

    var router = require("express").Router();

    // Create a Usuario
    router.post("/", usuarios.create);

    // Retrieve all usuarios
    router.get("/", usuarios.findAll);

    // Retrieve one usuario
    router.get("/:id", usuarios.findOne);

    // Update a Usuario
    router.put("/:id", usuarios.update);

    // Create notificacion
    router.post("/:id/notificaciones", usuarios.addNotification);

    // Remove notificacion
    router.delete("/:id/notificaciones", usuarios.removeNotification);

    // Delete a Usuario
    router.delete("/:id", usuarios.deleteOne);

    app.use('/api/usuarios', router);

}