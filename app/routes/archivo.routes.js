module.exports = app => {
    const archivos = require("../controllers/archivo.controller.js");

    var router = require("express").Router();

    const auth = require("../middlewares/middleware.security");

    // Retrieve all archivos
    router.get("/",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {archivos.findAll(req,res)} );

    // Retrieve one archivo
    router.get("/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {archivos.findOne(req,res)} );

    // Create one archivo
    router.post("/",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {archivos.create(req,res)} );

    // Update a archivo
    router.put("/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {archivos.update(req,res)} );

    // Delete a archivo
    router.delete("/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => { archivos.deleteOne(req,res)});

    app.use('/api/archivos', router);

}