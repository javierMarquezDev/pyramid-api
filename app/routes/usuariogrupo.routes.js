module.exports = app => {
    const usuariogrupos = require("../controllers/usuariogrupo.controller.js");

    var router = require("express").Router();

    // Retrieve all usuariogrupos
    router.get("/", usuariogrupos.findAll);

    // Retrieve all usuariogrupos by grupo
    router.get("/:codigo/:empresa", usuariogrupos.grupo);

    // Retrieve all usuariogrupos by usuario
    router.get("/:usuario", usuariogrupos.usuario);

    // Retrieve one usuariogrupo
    router.get("/:usuario/:codigo/:empresa", usuariogrupos.findOne);

    // Create one usuariogrupo
    router.post("/", usuariogrupos.create)

    // Update a usuariogrupo
    router.put("/:usuario/:codigo/:empresa", usuariogrupos.update);

    // Delete a usuariogrupo
    router.delete("/:usuario/:codigo/:empresa", usuariogrupos.deleteOne);

    app.use('/api/usuariogrupos', router);

}