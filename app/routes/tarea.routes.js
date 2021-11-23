module.exports = app => {
    const tareas = require("../controllers/tarea.controller.js");

    var router = require("express").Router();

    const auth = require("../middlewares/middleware.security");

    // Retrieve all tareas
    //router.get("/", tareas.findAll);

    // Retrieve all tareas from one proyecto
    router.get("/:administradorproyecto/:codigoproyecto",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {tareas.proyecto(req,res)} );

    // Retrieve one tarea
    router.get("/:administradorproyecto/:codigoproyecto/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {tareas.findOne(req,res)} );

    // Create one tarea
    router.post("/:administradorproyecto/:codigoproyecto",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {tareas.create(req,res)} );

    // Update a tarea
    router.put("/:administradorproyecto/:codigoproyecto/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {tareas.update(req,res)} );

    // Delete a tarea
    router.delete("/:administradorproyecto/:codigoproyecto/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {tareas.deleteOne(req,res)} );

    app.use('/api/tareas', router);

}