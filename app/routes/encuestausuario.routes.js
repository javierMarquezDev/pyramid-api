module.exports = app => {
    const encuestausuarios = require("../controllers/encuestausuario.controller.js");

    var router = require("express").Router();

    // Retrieve one encuestausuario
    router.get("/:id", encuestausuarios.findOne);

    // Delete a encuestausuario
    router.delete("/:id", encuestausuarios.deleteOne);

    app.use('/api/encuestausuarios', router);

}