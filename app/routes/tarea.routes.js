module.exports = app => {
    const tareas = require("../controllers/tarea.controller.js");

    var router = require("express").Router();

    const auth = require("../middlewares/middleware.security");

    // Retrieve all tareas
    //router.get("/", tareas.findAll);

    // Retrieve all tareas from one proyecto
    router.get("/:grupoempresa/:grupocodigo",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {tareas.proyecto(req,res)} );

    // Retrieve all tareas from one usuario
    router.get("/:usuario",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {tareas.usuario(req,res)} );

    //Retrieve all tareas from one usuario from one grupo
    router.get("/grupo/usuario/:usuario/:grupoempresa/:grupocodigo",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {tareas.grupousuario(req,res)} );

    // Retrieve one tarea
    router.get("/:grupoempresa/:grupocodigo/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {tareas.findOne(req,res)} );

    // Create one tarea
    router.post("/:grupoempresa/:grupocodigo",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {tareas.create(req,res)} );

    // Update a tarea
    router.put("/:grupoempresa/:grupocodigo/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {tareas.update(req,res)} );

    // Delete a tarea
    router.delete("/:grupoempresa/:grupocodigo/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {tareas.deleteOne(req,res)} );

    app.use('/api/tareas', router);
//
}