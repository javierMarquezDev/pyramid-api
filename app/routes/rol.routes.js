module.exports = app => {
    const rols = require("../controllers/rol.controller.js");
    const rolusuarios = require("../controllers/rolusuario.controller.js");

    var router = require("express").Router();

    // Retrieve all rols
    router.get("/", rols.findAll);

    // Retrieve one rol by nombre
    router.get("/nombres/:nombre", rols.nombre);

    // Retrieve one rol
    router.get("/:id", rols.findOne);

    //Retrieve usuarios by rol
    router.get("/:rol/usuarios", rolusuarios.rol);

    // Create one rol
    router.post("/", rols.create)

    // Update a rol
    router.put("/:id", rols.update);

    // Delete a rol
    router.delete("/:id", rols.deleteOne);

    app.use('/api/rols', router);

}