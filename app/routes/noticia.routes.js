module.exports = app => {
    const noticias = require("../controllers/noticia.controller.js");

    var router = require("express").Router();

    const auth = require("../middlewares/middleware.security");

    // Retrieve all noticias from group
    router.get("/:grupoempresa/:grupocodigo",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {noticias.grupo(req,res)} );

    // Retrieve all noticias from group from user
    router.get("/:grupoempresa/:grupocodigo/:autor",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {noticias.usuario(req,res)} );

    // Retrieve one noticia
    router.get("/:grupoempresa/:grupocodigo/:autor/:codigo",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {noticias.findOne(req,res)} );

    // Create one noticia
    router.post("/:grupoempresa/:grupocodigo/:autor",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {noticias.create(req,res)} );

    // Update a noticia
    router.put("/:grupoempresa/:grupocodigo/:autor/:codigo",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {noticias.update(req,res)} );

    // Delete a noticia 
    router.delete("/:grupoempresa/:grupocodigo/:autor/:codigo",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {noticias.deleteOne(req,res)} );

    app.use('/api/noticias', router);

}