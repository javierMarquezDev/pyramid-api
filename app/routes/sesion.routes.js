module.exports = app => {
    const sesions = require("../controllers/sesion.controller.js");

    var router = require("express").Router();

    // Retrieve all sesions
    router.get("/", sesions.findAll);

    // Retrieve one sesion
    router.get("/:id", sesions.findOne);

    // Update a sesion
    router.put("/:id", sesions.update);

    // Delete a sesion
    router.delete("/:id", sesions.deleteOne);

    app.use('/api/sesions', router);

}