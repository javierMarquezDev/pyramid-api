const db = require("../models");
const preguntas = db.preguntas;
const Op = db.Sequelize.Op;

//Crear pregunta
exports.create = (req, res) => {

    const pregunta = req.body;

    preguntas.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el pregunta."
            });
        });

}

// Mostrar todas els preguntas
exports.findAll = (req, res) => {
    preguntas.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    preguntas.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    preguntas.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La pregunta ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el pregunta con CIF ${id}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el pregunta con CIF " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    preguntas.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El pregunta fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el pregunta con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el pregunta con id " + id + "."
            });
        })
}