module.exports = app => {
    const empresas = require("../controllers/empresa.controller.js");

    var router = require("express").Router();

    // Retrieve all empresas
    router.get("/", empresas.findAll);

    // Create one empresa
    router.post("/", empresas.create)

    // Retrieve one empresa
    router.get("/:id", empresas.findOne)

    // Retrieve one empresa by nombre
    router.get("/name/:nombre", empresas.name)

    // Update a Empresa
    router.put("/:id", empresas.update);

    // Delete a Empresa
    router.delete("/:id", empresas.deleteOne);

    app.use('/api/empresas', router);

}