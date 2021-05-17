const db = require("../models");
const proyectos = db.proyectos;
const Op = db.Sequelize.Op;

//Crear proyecto
exports.create = (req, res) => {

    const proyecto = req.body;

    proyectos.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el proyecto."
            });
        });

}

// Mostrar todas els proyectos
exports.findAll = (req, res) => {
    proyectos.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    proyectos.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    proyectos.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La proyecto ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el proyecto con CIF ${id}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el proyecto con CIF " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    proyectos.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El proyecto fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el proyecto con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el proyecto con id " + id + "."
            });
        })
}