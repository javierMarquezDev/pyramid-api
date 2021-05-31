module.exports = app => {
    const noticias = require("../controllers/noticia.controller.js");

    var router = require("express").Router();

    // Retrieve all noticias from group
    router.get("/:grupoempresa/:grupocodigo", noticias.grupo);

    // Retrieve all noticias from group from user
    router.get("/:grupoempresa/:grupocodigo/:autor", noticias.usuario);

    // Retrieve one noticia
    router.get("/:grupoempresa/:grupocodigo/:autor/:codigo", noticias.findOne);

    // Create one noticia
    router.post("/:grupoempresa/:grupocodigo/:autor", noticias.create)

    // Update a noticia
    router.put("/:grupoempresa/:grupocodigo/:autor/:codigo", noticias.update);

    // Delete a noticia
    router.delete("/:grupoempresa/:grupocodigo/:autor/:codigo", noticias.deleteOne);

    app.use('/api/noticias', router);

}