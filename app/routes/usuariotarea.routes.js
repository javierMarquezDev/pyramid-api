module.exports = app => {
    const usuariotareas = require("../controllers/usuariotarea.controller.js");

    var router = require("express").Router();

    // Retrieve all usuariotareas
    router.get("/", usuariotareas.findAll);

    // Retrieve one
    router.get("/:tareaadministradorproyecto/:tareacodigoproyecto/:tareacodigo/:atareado", usuariotareas.findOne);

    // Create one usuariotarea
    router.post("/:tareaadministradorproyecto/:tareacodigoproyecto/:tareacodigo", usuariotareas.create)

    // Update a usuariotarea
    router.put("/:tareaadministradorproyecto/:tareacodigoproyecto/:tareacodigo/:atareado", usuariotareas.update);

    //Retrieve by usuario
    router.get("/:atareado", usuariotareas.usuario);

    //Retrieve by tarea
    router.get("/:tareaadministradorproyecto/:tareacodigoproyecto/:tareacodigo", usuariotareas.tarea);

    // Delete a usuariotarea
    router.delete("/:tareaadministradorproyecto/:tareacodigoproyecto/:tareacodigo/:atareado", usuariotareas.deleteOne);

    app.use('/api/usuariotareas', router);

}