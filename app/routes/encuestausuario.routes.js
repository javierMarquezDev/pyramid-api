module.exports = app => {
    const encuestausuarios = require("../controllers/encuestausuario.controller.js");

    var router = require("express").Router();

    // Retrieve one encuestausuario
    router.get("/:encuestaautor/:encuestacodigo/:encuestado", encuestausuarios.findOne);

    // Retrieve by encuesta
    router.get("/:encuestaautor/:encuestacodigo", encuestausuarios.encuesta);

    // Retrieve one usuario
    router.get(":encuestado", encuestausuarios.usuario);

    // Create one encuestausuario
    router.post("/:encuestaautor/:encuestacodigo", encuestausuarios.create)

    // Delete a encuestausuario
    router.delete("/:encuestaautor/:encuestacodigo/:encuestado", encuestausuarios.deleteOne);

    app.use('/api/encuestausuarios', router);

}