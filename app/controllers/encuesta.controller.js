const db = require("../models");
const Encuestas = db.encuestas;
const Op = db.Sequelize.Op;

//Crear encuesta
exports.create = (req, res) => {

    const encuesta = req.body;

    Encuestas.create(encuesta).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando la encuesta."
            });
        });

}

// Mostrar todas las encuestas
exports.findAll = (req, res) => {
    Encuestas.findAll().then(data => { res.status(200).json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    Encuestas.findByPk(req.params.id).then(data => { res.status(200).json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    Encuestas.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La encuesta ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar la encuesta con CIF ${id}. Compruebe la dirección o la cuerpo de la request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando la encuesta con CIF " + id + "."
            });
        });
};

// ELiminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    Encuestas.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "la encuesta fue eliminada con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse la encuesta con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar la encuesta con id " + id + "."
            });
        })
}