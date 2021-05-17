const db = require("../models");
const proyectousuarios = db.proyectousuarios;
const Op = db.Sequelize.Op;

//Crear proyectousuario
exports.create = (req, res) => {

    const proyectousuario = req.body;

    proyectousuarios.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el proyectousuario."
            });
        });

}

// Mostrar todas els proyectousuarios
exports.findAll = (req, res) => {
    proyectousuarios.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    proyectousuarios.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    proyectousuarios.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La proyectousuario ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el proyectousuario con CIF ${id}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el proyectousuario con CIF " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    proyectousuarios.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El proyectousuario fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el proyectousuario con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el proyectousuario con id " + id + "."
            });
        })
}