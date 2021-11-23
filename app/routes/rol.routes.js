module.exports = app => {
    const rols = require("../controllers/rol.controller.js");
    const rolusuarios = require("../controllers/rolusuario.controller.js");

    var router = require("express").Router();

    const auth = require("../middlewares/middleware.security");

    // Retrieve all rols
    router.get("/", rols.findAll);

    // Retrieve one rol by nombre
    router.get("/nombres/:nombre",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {rols.nombre(req,res)} );

    // Retrieve one rol
    router.get("/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {rols.findOne(req,res)} );

    //Retrieve usuarios by rol
    router.get("/:rol/usuarios",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {rolusuarios.rol(req,res)} );

    // Create one rol
    router.post("/",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {rols.create(req,res)} );

    // Update a rol
    router.put("/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {rols.update(req,res)} );

    // Delete a rol
    router.delete("/:id",  (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {rols.deleteOne(req,res)} );

    app.use('/api/rols', router);

}