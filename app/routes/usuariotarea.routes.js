module.exports = app => {
    const usuariotareas = require("../controllers/usuariotarea.controller.js");

    var router = require("express").Router();

    // Retrieve all usuariotareas
    router.get("/", usuariotareas.findAll);

    // Retrieve one usuariotarea
    router.get("/:id", usuariotareas.findOne);

    // Update a usuariotarea
    router.put("/:id", usuariotareas.update);

    // Delete a usuariotarea
    router.delete("/:id", usuariotareas.deleteOne);

    app.use('/api/usuariotareas', router);

}