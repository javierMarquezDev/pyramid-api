module.exports = app => {
    const archivos = require("../controllers/archivo.controller.js");

    var router = require("express").Router();

    // Retrieve all archivos
    router.get("/", archivos.findAll);

    // Retrieve one archivo
    router.get("/:id", archivos.findOne);

    // Create one archivo
    router.post("/", archivos.create)

    // Update a archivo
    router.put("/:id", archivos.update);

    // Delete a archivo
    router.delete("/:id", archivos.deleteOne);

    app.use('/api/archivos', router);

}