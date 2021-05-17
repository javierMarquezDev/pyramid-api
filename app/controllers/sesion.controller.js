const db = require("../models");
const sesions = db.sesiones;
const Op = db.Sequelize.Op;

//Crear sesion
exports.create = (req, res) => {

    const sesion = req.body;

    sesions.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el sesion."
            });
        });

}

// Mostrar todas els sesions
exports.findAll = (req, res) => {
    sesions.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    sesions.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    sesions.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La sesion ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el sesion con CIF ${id}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el sesion con CIF " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    sesions.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El sesion fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el sesion con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el sesion con id " + id + "."
            });
        })
}