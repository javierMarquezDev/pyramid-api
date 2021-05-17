const db = require("../models");
const grupos = db.grupos;
const Op = db.Sequelize.Op;

//Crear grupo
exports.create = (req, res) => {

    const grupo = req.body;

    grupos.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el grupo."
            });
        });

}

// Mostrar todas els grupos
exports.findAll = (req, res) => {
    grupos.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    grupos.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    grupos.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La grupo ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el grupo con CIF ${id}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el grupo con CIF " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    grupos.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El grupo fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el grupo con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el grupo con id " + id + "."
            });
        })
}