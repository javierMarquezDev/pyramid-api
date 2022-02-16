module.exports = app => {
    const empresas = require("../controllers/empresa.controller.js");

    var router = require("express").Router();

    const auth = require("../middlewares/middleware.security");

    // Retrieve all empresas
    router.get("/",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.findAll(req,res)} );

    // Create one empresa
    router.post("/",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.create(req,res)} );

    // Retrieve one empresa
    router.get("/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.findOne(req,res)} );

    // Retrieve one empresa by nombre
    router.get("/name/:nombre",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.name(req,res)} );

    // Retrieve one empresa by admin
    router.get("/admin/:admin",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.admin(req,res)} );

    // Update a Empresa
    router.put("/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.update(req,res)} );

    // Delete a Empresa
    router.delete("/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.deleteOne(req,res)} );

    app.use('/api/empresas',  (req,res,next)=>{auth.auth(req,res,next)}, router);

}