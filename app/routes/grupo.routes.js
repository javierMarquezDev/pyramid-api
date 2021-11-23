const usuariogrupo = require("../models/usuariogrupo.js");

module.exports = app => {
    const grupos = require("../controllers/grupo.controller.js");
    const usuariogrupos = require("../controllers/usuariogrupo.controller.js");

    const auth = require("../middlewares/middleware.security");


    var router = require("express").Router();

    // Retrieve all grupos
    //router.get("/", grupos.findAll);

    //Asociar usuario a grupo
    router.post("/:empresa/:id",  (req,res,next)=>{auth.auth(req,res,next)}, usuariogrupos.create);

    // Retrieve one grupo
    router.get("/:empresa/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.findOne(req,res)} );

    // Retrieve grupos from one empresa
    router.get("/:empresa",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.empresa(req,res)} );

    // Create one grupo
    router.post("/:empresa",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => { grupos.create(req,res)});

    // Update a grupo
    router.put("/:empresa/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.update(req,res)} );

    // Delete a grupo
    router.delete("/:empresa/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.deleteOne(req,res)} );

    app.use('/api/grupos', router);

}