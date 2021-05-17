module.exports = app => {
    const mensajes = require("../controllers/mensaje.controller.js");

    var router = require("express").Router();

    // Retrieve all mensajes
    router.get("/", mensajes.findAll);

    // Retrieve one mensaje
    router.get("/:id", mensajes.findOne);

    // Update a mensaje
    router.put("/:id", mensajes.update);

    // Delete a mensaje
    router.delete("/:id", mensajes.deleteOne);

    app.use('/api/mensajes', router);

}