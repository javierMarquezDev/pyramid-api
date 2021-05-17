const db = require("../models");
const Rols = db.roles;
const Op = db.Sequelize.Op;

//Crear rol
exports.create = (req, res) => {

    const rol = req.body;

    Rols.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el rol."
            });
        });

}

// Mostrar todas els Rols
exports.findAll = (req, res) => {
    Rols.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    Rols.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    Rols.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La rol ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el rol con CIF ${id}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el rol con CIF " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    Rols.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El rol fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el rol con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el rol con id " + id + "."
            });
        })
}