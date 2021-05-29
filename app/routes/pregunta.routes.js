module.exports = app => {
    const preguntas = require("../controllers/pregunta.controller.js");

    var router = require("express").Router();

    // Retrieve all preguntas
    //router.get("/", preguntas.findAll);

    //Retrieve by encuesta
    router.get("/:encuestaautor/:encuestacodigo", preguntas.encuesta);

    // Retrieve one pregunta
    router.get("/:encuestaautor/:encuestacodigo/:id", preguntas.findOne);

    // Create one pregunta
    router.post("/:encuestaautor/:encuestacodigo", preguntas.create)

    // Update a pregunta
    router.put("/:encuestaautor/:encuestacodigo/:id", preguntas.update);

    // Delete a pregunta
    router.delete("/:encuestaautor/:encuestacodigo/:id", preguntas.deleteOne);

    app.use('/api/preguntas', router);

}