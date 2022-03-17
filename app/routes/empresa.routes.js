module.exports = app => {
    const empresas = require("../controllers/empresa.controller.js");

    var router = require("express").Router();

    const auth = require("../middlewares/middleware.security");

    //Añadir vaios usuarios
    router.post("/empresausuarios/bulk",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.addUsuarios(req,res)} );

    //Añadir vaios usuarios
    router.post("/empresausuarios/bulk/:empresa",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.modifyUsuarios(req,res)} );

    // Retrieve all empresas
    router.get("/",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.findAll(req,res)} );

    // Create one empresa//
    router.post("/",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.create(req,res)} );

    //Check if usuario is admin
    router.get("/checkadmin/:cif/:email",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.checkAdmin(req,res)} );

    //Check if usuario is miembro
    router.get("/checkmember/:cif/:email",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.checkmember(req,res)} );

    // Retrieve one empresa
    router.get("/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.findOne(req,res)} );

    // Retrieve one empresa by nombre
    router.get("/name/:nombre",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.name(req,res)} );

    // Retrieve empresas by usuario
    router.get("/usuario/:email",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.empresasusuario(req,res)} );

    // Retrieve usuarios by empresa
    router.get("/usuarios/:cif",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.usuariosempresa(req,res)} );

    // Retrieve empresas by admin
    router.get("/empresasadmin/:email",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.empresasadmin(req,res)} );

    // Retrieve admins by empresa
    router.get("/adminsempresa/:cif",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.adminsempresa(req,res)} );

    

    // Update a Empresa
    router.put("/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.update(req,res)} );

    // Delete a Empresa
    router.delete("/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {empresas.deleteOne(req,res)} );

    app.use('/api/empresas',  (req,res,next)=>{auth.auth(req,res,next)}, router);

}