const db = require("../models");
const Archivos = db.archivos;
const Op = db.Sequelize.Op;

//Crear archivo
exports.create = (req, res) => {

    const archivo = req.body;

    Archivos.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el archivo."
            });
        });

}

// Mostrar todas els archivos
exports.findAll = (req, res) => {
    Archivos.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    Archivos.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    Archivos.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La archivo ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el archivo con CIF ${id}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el archivo con CIF " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    Archivos.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El archivo fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el archivo con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el archivo con id " + id + "."
            });
        })
}