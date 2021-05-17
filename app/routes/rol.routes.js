module.exports = app => {
    const rols = require("../controllers/rol.controller.js");

    var router = require("express").Router();

    // Retrieve all rols
    router.get("/", rols.findAll);

    // Retrieve one rol
    router.get("/:id", rols.findOne);

    // Update a rol
    router.put("/:id", rols.update);

    // Delete a rol
    router.delete("/:id", rols.deleteOne);

    app.use('/api/rols', router);

}