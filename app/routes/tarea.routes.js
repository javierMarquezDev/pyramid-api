module.exports = app => {
    const tareas = require("../controllers/tarea.controller.js");

    var router = require("express").Router();

    // Retrieve all tareas
    //router.get("/", tareas.findAll);

    // Retrieve all tareas from one proyecto
    router.get("/:administradorproyecto/:codigoproyecto", tareas.proyecto);

    // Retrieve one tarea
    router.get("/:administradorproyecto/:codigoproyecto/:id", tareas.findOne);

    // Create one tarea
    router.post("/:administradorproyecto/:codigoproyecto", tareas.create)

    // Update a tarea
    router.put("/:administradorproyecto/:codigoproyecto/:id", tareas.update);

    // Delete a tarea
    router.delete("/:administradorproyecto/:codigoproyecto/:id", tareas.deleteOne);

    app.use('/api/tareas', router);

}