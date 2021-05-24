module.exports = app => {
    const encuestausuarios = require("../controllers/encuestausuario.controller.js");

    var router = require("express").Router();

    // Retrieve one encuestausuario
    router.get("/:id", encuestausuarios.findOne);

    // Create one encuestausuario
    router.post("/", encuestausuarios.create)

    // Delete a encuestausuario
    router.delete("/:id", encuestausuarios.deleteOne);

    app.use('/api/encuestausuarios', router);

}