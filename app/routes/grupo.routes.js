module.exports = app => {
    const grupos = require("../controllers/grupo.controller.js");

    var router = require("express").Router();

    // Retrieve all grupos
    router.get("/", grupos.findAll);

    // Retrieve one grupo
    router.get("/:id", grupos.findOne);

    // Create one grupo
    router.post("/", grupos.create)

    // Update a grupo
    router.put("/:id", grupos.update);

    // Delete a grupo
    router.delete("/:id", grupos.deleteOne);

    app.use('/api/grupos', router);

}