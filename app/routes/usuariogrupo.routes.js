module.exports = app => {
    const usuariogrupos = require("../controllers/usuariogrupo.controller.js");

    var router = require("express").Router();

    const auth = require("../middlewares/middleware.security");

    // Retrieve all usuariogrupos
    router.get("/",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => { usuariogrupos.findAll(req,res)});

    // Retrieve all usuariogrupos by grupo
    router.get("/:codigo/:empresa",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuariogrupos.grupo(req,res)} );

    // Retrieve all usuariogrupos by usuario
    router.get("/:usuario",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuariogrupos.usuario(req,res)} );

    // Retrieve one usuariogrupo
    router.get("/:usuario/:codigo/:empresa",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuariogrupos.findOne(req,res)} );

    // Create one usuariogrupo
    router.post("/",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuariogrupos.create(req,res)} );

    // Update a usuariogrupo
    router.put("/:usuario/:codigo/:empresa",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuariogrupos.update(req,res)} );

    // Delete a usuariogrupo
    router.delete("/:usuario/:codigo/:empresa",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuariogrupos.deleteOne(req,res)} );

    app.use('/api/usuariogrupos', router);

}