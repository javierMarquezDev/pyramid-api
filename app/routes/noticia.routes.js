module.exports = app => {
    const noticias = require("../controllers/noticia.controller.js");

    var router = require("express").Router();

    // Retrieve all noticias
    router.get("/", noticias.findAll);

    // Retrieve one noticia
    router.get("/:id", noticias.findOne);

    // Create one noticia
    router.post("/", noticias.create)

    // Update a noticia
    router.put("/:id", noticias.update);

    // Delete a noticia
    router.delete("/:id", noticias.deleteOne);

    app.use('/api/noticias', router);

}