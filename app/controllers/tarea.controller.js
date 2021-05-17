const db = require("../models");
const tareas = db.tareas;
const Op = db.Sequelize.Op;

//Crear tarea
exports.create = (req, res) => {

    const tarea = req.body;

    tareas.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el tarea."
            });
        });

}

// Mostrar todas els tareas
exports.findAll = (req, res) => {
    tareas.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    tareas.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    tareas.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La tarea ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el tarea con CIF ${id}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el tarea con CIF " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    tareas.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El tarea fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el tarea con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el tarea con id " + id + "."
            });
        })
}