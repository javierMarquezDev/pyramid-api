module.exports = app => {
    const usuarios = require("../controllers/usuario.controller.js");

    var router = require("express").Router();

    const auth = require("../middlewares/middleware.security");
    
    // Create a Usuario
    router.post("/", usuarios.create);

    // Retrieve all usuarios
    router.get("/", (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuarios.findAll(req,res)});

    // Retrieve one usuario
    router.get("/:id",(req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuarios.findOne(req,res)});

    // Update a Usuario
    router.put("/:id",(req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuarios.update(req,res)});

    //Retrieve all notificaciones
    router.get("/:id/notificaciones", (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuarios.getNotification(req,res)});

    //Retrieve one notificacion
    router.get("/:id/notificaciones/:notificacion", (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuarios.getOneNotification(req,res)});

    // Create notificacion
    router.post("/:id/notificaciones", (req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuarios.addNotification(req,res)});

    // Remove notificacion
    router.delete("/:id/notificaciones/:notificacion",(req,res,next)=>{auth.auth(req,res,next)}, (req,res) => {usuarios.removeNotification(req,res)});

    // Delete a Usuario
    router.delete("/:id",(req,res,next)=>{auth.auth(req,res,next)}, (req,res) => { usuarios.deleteOne(req,res)});

    app.use('/api/usuarios', router);

}