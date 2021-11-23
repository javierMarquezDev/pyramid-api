module.exports = app => {
    const proyectousuarios = require("../controllers/proyectousuario.controller.js");

    var router = require("express").Router();

    const auth = require("../middlewares/middleware.security");

    // Retrieve all proyectousuarios
    router.get("/",  (req,res,next)=>{auth.auth(req,res,next)}, proyectousuarios.findAll);

    // Retrieve one proyectousuario
    router.get("/:usuario/:proyectoadministrador/:proyectocodigo",  (req,res,next)=>{auth.auth(req,res,next)}, proyectousuarios.findOne);

    // Retrieve by usuario
    router.get("/:usuario", (req,res) => {proyectousuarios.usuario(req,res)} );

    // Retrieve by proyecto
    router.get("/:proyectoadministrador/:proyectocodigo",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {proyectousuarios.proyecto(req,res)} );

    // Create one proyectousuario
    router.post("/:proyectoadministrador/:proyectocodigo",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {proyectousuarios.create(req,res)} );

    // Update a proyectousuario
    router.put("/:usuario/:proyectoadministrador/:proyectocodigo",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {proyectousuarios.update(req,res)} );

    // Delete a proyectousuario
    router.delete("/:usuario/:proyectoadministrador/:proyectocodigo",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {proyectousuarios.deleteOne(req,res)} );

    app.use('/api/proyectousuarios', router);

}