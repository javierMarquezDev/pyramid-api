module.exports = app => {
    const mensajes = require("../controllers/mensaje.controller.js");

    var router = require("express").Router();

    // Retrieve all mensajes
    //router.get("/", mensajes.findAll);

    //Retrieve by sent
    router.get("/:sender/sent", mensajes.sent);

    //Retrieve by received
    router.get("/:receiver/received", mensajes.received);

    //Retrieve by usuario
    router.get("/:sender/:receiver", mensajes.findAll);

    router.get("/:receiver/:sender", mensajes.findAll);

    //All
    router.get("/:usuario1/:usuario2/conversation", mensajes.conversation);



    // Retrieve one mensaje
    router.get("/:sender/:receiver/:id", mensajes.findOne);

    // Create one mensaje
    router.post("/:sender/:receiver", mensajes.create)

    // Update a mensaje
    router.put("/:sender/:receiver/:id", mensajes.update);

    // Delete a mensaje
    router.delete("/:sender/:receiver/:id", mensajes.deleteOne);

    app.use('/api/mensajes', router);

}