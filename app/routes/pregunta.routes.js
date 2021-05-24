module.exports = app => {
    const preguntas = require("../controllers/pregunta.controller.js");

    var router = require("express").Router();

    // Retrieve all preguntas
    router.get("/", preguntas.findAll);

    // Retrieve one pregunta
    router.get("/:id", preguntas.findOne);

    // Create one pregunta
    router.post("/", preguntas.create)

    // Update a pregunta
    router.put("/:id", preguntas.update);

    // Delete a pregunta
    router.delete("/:id", preguntas.deleteOne);

    app.use('/api/preguntas', router);

}