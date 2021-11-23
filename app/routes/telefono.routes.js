module.exports = app => {
    const telefonos = require("../controllers/telefono.controller.js");

    var router = require("express").Router();

    const auth = require("../middlewares/middleware.security");

    // Retrieve all telefonos
    router.get("/",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {telefonos.findAll(req,res)} );

    // Retrieve one telefono
    router.get("/numero/:numero",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {telefonos.findOne(req,res)} );

    // Retrieve telefonos by usuario
    router.get("/usuarios/:usuario",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {telefonos.usuario(req,res)} );

    // Retrieve telefonos by empresa
    router.get("/empresas/:empresa",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {telefonos.empresa(req,res)} );

    // Create one telefono
    router.post("/",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {telefonos.create(req,res)} );

    // Update a telefono
    router.put("/:numero",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {telefonos.update(req,res)} );

    // Delete a telefono
    router.delete("/:numero",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {telefonos.deleteOne(req,res)} );

    app.use('/api/telefonos', router);

}