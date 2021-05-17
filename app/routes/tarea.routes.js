module.exports = app => {
    const tareas = require("../controllers/tarea.controller.js");

    var router = require("express").Router();

    // Retrieve all tareas
    router.get("/", tareas.findAll);

    // Retrieve one tarea
    router.get("/:id", tareas.findOne);

    // Update a tarea
    router.put("/:id", tareas.update);

    // Delete a tarea
    router.delete("/:id", tareas.deleteOne);

    app.use('/api/tareas', router);

}