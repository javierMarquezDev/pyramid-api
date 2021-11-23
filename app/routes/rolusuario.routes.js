module.exports = app => {
    const rolusuarios = require("../controllers/rolusuario.controller.js");

    var router = require("express").Router();

    const auth = require("../middlewares/middleware.security");

    // Retrieve all rolusuarios
    router.get("/",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {rolusuarios.findAll(req,res)}  );

    // Retrieve all usuarios by rol
    router.get("/:rol",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {rolusuarios.rol(req,res)} );

    // Retrieve all rols by usuario
    router.get("/:usuario",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {rolusuarios.usuario(req,res)} );

    // Retrieve one rolusuario
    router.get("/:rol/:usuario",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {rolusuarios.findOne(req,res)} );

    // Create one rolusuario
    router.post("/",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {rolusuarios.create(req,res)} );

    // Update a rolusuario
    router.put("/:rol/:usuario",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {rolusuarios.update(req,res)} );

    // Delete a rolusuario
    router.delete("/:rol/:usuario",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {rolusuarios.deleteOne(req,res)} );

    app.use('/api/rolusuarios', router);

}