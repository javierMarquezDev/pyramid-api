module.exports = app => {
    const grupos = require("../controllers/grupo.controller.js");

    var router = require("express").Router();

    // Retrieve all grupos
    //router.get("/", grupos.findAll);

    // Retrieve one grupo
    router.get("/:empresa/:id", grupos.findOne);

    // Retrieve grupos from one empresa
    router.get("/:empresa", grupos.empresa);

    // Create one grupo
    router.post("/:empresa", grupos.create)

    // Update a grupo
    router.put("/:empresa/:id", grupos.update);

    // Delete a grupo
    router.delete("/:empresa/:id", grupos.deleteOne);

    app.use('/api/grupos', router);

}