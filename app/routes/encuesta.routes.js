module.exports = app => {
    const encuestas = require("../controllers/encuesta.controller.js");

    var router = require("express").Router();

    // Retrieve all encuestas
    router.get("/", encuestas.findAll);

    // Retrieve all encuestas by usuario
    router.get("/:autor", encuestas.usuario);

    // Retrieve one encuesta
    router.get("/:autor/:id", encuestas.findOne);

    // Create one encuesta
    router.post("/:autor", encuestas.create)

    // Update a encuesta
    router.put("/:autor/:id", encuestas.update);

    // Delete a encuesta
    router.delete("/:autor/:id", encuestas.deleteOne);

    app.use('/api/encuestas', router);

}