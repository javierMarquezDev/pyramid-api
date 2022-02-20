module.exports = app => {
    const empresausuarios = require("../controllers/empresausuario.controller.js");

    var router = require("express").Router();

    const auth = require("../middlewares/middleware.security");

    // Retrieve all empresausuarios by empresa
    router.get("/:empresa",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresausuarios.empresa(req,res)} );

    // Retrieve all empresausuarios by usuario
    router.get("/:usuario",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresausuarios.usuario(req,res)} );

    // Retrieve one empresausuario
    router.get("/:empresa/:usuario",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresausuarios.findOne(req,res)} );

    // Create one empresausuario
    router.post("/",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresausuarios.create(req,res)} );

    // Update a empresausuario
    router.put("/:empresa/:usuario",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresausuarios.update(req,res)} );

    // Delete a empresausuario
    router.delete("/:empresa/:usuario",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresausuarios.deleteOne(req,res)} );

    app.use('/api/empresausuarios', router);

}