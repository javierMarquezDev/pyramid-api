module.exports = app => {
    const encuestausuarios = require("../controllers/encuestausuario.controller.js");

    var router = require("express").Router();

    // Retrieve all encuestausuarios
    router.get("/", encuestausuarios.findAll);

    // Retrieve one encuestausuario
    router.get("/:id", encuestausuarios.findOne);

    // Update a encuestausuario
    router.put("/:id", encuestausuarios.update);

    // Delete a encuestausuario
    router.delete("/:id", encuestausuarios.deleteOne);

    app.use('/api/encuestausuarios', router);

}