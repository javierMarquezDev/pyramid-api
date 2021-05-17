module.exports = app => {
    const empresas = require("../controllers/empresa.controller.js");

    var router = require("express").Router();

    // Retrieve all empresas
    router.get("/", empresas.findAll);

    // Retrieve one empresa
    router.get("/:id", empresas.findOne);

    // Update a Empresa
    router.put("/:id", empresas.update);

    // Delete a Empresa
    router.delete("/:id", empresas.deleteOne);

    app.use('/api/empresas', router);

}