module.exports = app => {
    const telefonos = require("../controllers/telefono.controller.js");

    var router = require("express").Router();

    // Retrieve all telefonos
    router.get("/", telefonos.findAll);

    // Retrieve one telefono
    router.get("/:id", telefonos.findOne);

    // Update a telefono
    router.put("/:id", telefonos.update);

    // Delete a telefono
    router.delete("/:id", telefonos.deleteOne);

    app.use('/api/telefonos', router);

}