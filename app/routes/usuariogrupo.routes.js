module.exports = app => {
    const usuariogrupos = require("../controllers/usuariogrupo.controller.js");

    var router = require("express").Router();

    // Retrieve all usuariogrupos
    router.get("/", usuariogrupos.findAll);

    // Retrieve one usuariogrupo
    router.get("/:id", usuariogrupos.findOne);

    // Update a usuariogrupo
    router.put("/:id", usuariogrupos.update);

    // Delete a usuariogrupo
    router.delete("/:id", usuariogrupos.deleteOne);

    app.use('/api/usuariogrupos', router);

}