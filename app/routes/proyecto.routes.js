module.exports = app => {
    const proyectos = require("../controllers/proyecto.controller.js");

    var router = require("express").Router();
    
    const auth = require("../middlewares/middleware.security");
    
    // Retrieve all proyectos
    router.get("/", proyectos.findAll);

    // Retrieve all proyectos from one user
    router.get("/:administrador" ,  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {proyectos.administrador(req,res)} );

    // Retrieve one proyecto
    router.get("/:administrador/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {proyectos.findOne(req,res)} );

    // Create one proyecto
    router.post("/:administrador",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {proyectos.create(req,res)} );

    // Update a proyecto
    router.put("/:administrador/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {proyectos.update(req,res)} );

    // Delete a proyecto
    router.delete("/:administrador/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {proyectos.deleteOne(req,res)} );

    app.use('/api/proyectos', router);

}