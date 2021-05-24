module.exports = app => {
    const encuestas = require("../controllers/encuesta.controller.js");

    var router = require("express").Router();

    // Retrieve all encuestas
    router.get("/", encuestas.findAll);

    // Retrieve one encuesta
    router.get("/:id", encuestas.findOne);

    // Create one encuesta
    router.post("/", encuestas.create)

    // Update a encuesta
    router.put("/:id", encuestas.update);

    // Delete a encuesta
    router.delete("/:id", encuestas.deleteOne);

    app.use('/api/encuestas', router);

}