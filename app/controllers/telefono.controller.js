const db = require("../models");
const telefonos = db.telefonos;
const Op = db.Sequelize.Op;

//Crear telefono
exports.create = (req, res) => {

    const telefono = req.body;

    telefonos.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el telefono."
            });
        });

}

// Mostrar todas els telefonos
exports.findAll = (req, res) => {
    telefonos.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    telefonos.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    telefonos.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La telefono ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el telefono con CIF ${id}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el telefono con CIF " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    telefonos.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El telefono fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el telefono con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el telefono con id " + id + "."
            });
        })
}