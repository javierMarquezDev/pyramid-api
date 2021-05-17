const db = require("../models");
const rolusuarios = db.rolusuarios;
const Op = db.Sequelize.Op;

//Crear rolusuario
exports.create = (req, res) => {

    const rolusuario = req.body;

    rolusuarios.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el rolusuario."
            });
        });

}

// Mostrar todas els rolusuarios
exports.findAll = (req, res) => {
    rolusuarios.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    rolusuarios.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    rolusuarios.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La rolusuario ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el rolusuario con CIF ${id}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el rolusuario con CIF " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    rolusuarios.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El rolusuario fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el rolusuario con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el rolusuario con id " + id + "."
            });
        })
}