const db = require("../models");
const mensajes = db.mensajes;
const Op = db.Sequelize.Op;

//Crear mensaje
exports.create = (req, res) => {

    const mensaje = req.body;

    mensajes.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el mensaje."
            });
        });

}

// Mostrar todas els mensajes
exports.findAll = (req, res) => {
    mensajes.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    mensajes.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    mensajes.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La mensaje ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el mensaje con CIF ${id}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el mensaje con CIF " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    mensajes.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El mensaje fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el mensaje con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el mensaje con id " + id + "."
            });
        })
}