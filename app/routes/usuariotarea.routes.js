module.exports = app => {
    const usuariotareas = require("../controllers/usuariotarea.controller.js");

    var router = require("express").Router();

    const auth = require("../middlewares/middleware.security");

    // Retrieve all usuariotareas
    router.get("/",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuariotareas.findAll(req,res)} );

    // Retrieve one
    router.get("/:tareaadministradorproyecto/:tareacodigoproyecto/:tareacodigo/:atareado",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuariotareas.findOne(req,res)} );

    // Create one usuariotarea
    router.post("/:tareaadministradorproyecto/:tareacodigoproyecto/:tareacodigo",   (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuariotareas.create(req,res)});

    // Update a usuariotarea
    router.put("/:tareaadministradorproyecto/:tareacodigoproyecto/:tareacodigo/:atareado",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuariotareas.update(req,res)} );

    //Retrieve by usuario
    router.get("/:atareado",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuariotareas.usuario(req,res)} );

    //Retrieve by tarea
    router.get("/:tareaadministradorproyecto/:tareacodigoproyecto/:tareacodigo",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuariotareas.tarea(req,res)} );

    // Delete a usuariotarea
    router.delete("/:tareaadministradorproyecto/:tareacodigoproyecto/:tareacodigo/:atareado",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuariotareas.deleteOne(req,res)} );

    app.use('/api/usuariotareas', router);

}