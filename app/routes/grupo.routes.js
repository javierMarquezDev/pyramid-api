const usuariogrupo = require("../models/usuariogrupo.js");

module.exports = app => {
    const grupos = require("../controllers/grupo.controller.js");
    const usuariogrupos = require("../controllers/usuariogrupo.controller.js");

    const auth = require("../middlewares/middleware.security");


    var router = require("express").Router();

    // Retrieve all grupos
    //router.get("/", grupos.findAll);

    //Añadir vaios usuarios
    router.post("/grupousuarios/bulk",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.addUsuarios(req,res)} );

    //Modificar usuarios
    router.post("/grupousuarios/bulk/:empresa/:codigo",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.modifyUsuarios(req,res)} );

    // Retrieve grupos from one empresa
    router.get("/empresa/search/:empresa",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.empresa(req,res)} );

    //Retrieve grupos from one usuario
    router.get("/usuario/search/:user", (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.usuario(req,res)} );

    //Retrieve usuarios from grupo
    router.get("/usuarios/search/:empresa/:codigo", (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.usuarios(req,res)} );

    //Retrieve grupos from one admin
    router.get("/admin/search/:admin", (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.gruposadmin(req,res)} );

    //Check if user is admin
    router.get("/checkadmin/:grupoempresa/:grupocodigo/:email", (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.checkAdmin(req,res)} );

    //Retrieve admins from one grupo
    router.get("/admins/search/:empresa/:codigo", (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.adminsgrupo(req,res)} );

    //Retrieve grupos from fin
    router.get("/finalizado/search/:fin", (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.fin(req,res)} );

    //Asociar usuario a grupo
    router.post("/:empresa/:id",  (req,res,next)=>{auth.auth(req,res,next)},  (req,res) => {usuariogrupos.create(req,res)} );

    // Retrieve one grupo
    router.get("/:empresa/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.findOne(req,res)} );

    // Create one grupo
    router.post("/:empresa",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => { grupos.create(req,res)});

    // Update a grupo
    router.put("/:empresa/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.update(req,res)} );

    // Delete a grupo
    router.delete("/:empresa/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {grupos.deleteOne(req,res)} );

    app.use('/api/grupos', router);

}