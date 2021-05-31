module.exports = app => {
    const telefonos = require("../controllers/telefono.controller.js");

    var router = require("express").Router();

    // Retrieve all telefonos
    router.get("/", telefonos.findAll);

    // Retrieve one telefono
    router.get("/numero/:numero", telefonos.findOne);

    // Retrieve telefonos by usuario
    router.get("/usuarios/:usuario", telefonos.usuario);

    // Retrieve telefonos by empresa
    router.get("/empresas/:empresa", telefonos.empresa);

    // Create one telefono
    router.post("/", telefonos.create)

    // Update a telefono
    router.put("/:numero", telefonos.update);

    // Delete a telefono
    router.delete("/:numero", telefonos.deleteOne);

    app.use('/api/telefonos', router);

}