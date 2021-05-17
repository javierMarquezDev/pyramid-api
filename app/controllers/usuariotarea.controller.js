const db = require("../models");
const usuariotareas = db.usuariotareas;
const Op = db.Sequelize.Op;

//Crear usuariotarea
exports.create = (req, res) => {

    const usuariotarea = req.body;

    usuariotareas.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el usuariotarea."
            });
        });

}

// Mostrar todas els usuariotareas
exports.findAll = (req, res) => {
    usuariotareas.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    usuariotareas.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    usuariotareas.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La usuariotarea ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el usuariotarea con CIF ${id}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el usuariotarea con CIF " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    usuariotareas.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El usuariotarea fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el usuariotarea con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el usuariotarea con id " + id + "."
            });
        })
}