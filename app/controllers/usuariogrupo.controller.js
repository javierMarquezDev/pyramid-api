const db = require("../models");
const usuariogrupos = db.usuariogrupos;
const Op = db.Sequelize.Op;

//Crear usuariogrupo
exports.create = (req, res) => {

    const usuariogrupo = req.body;

    usuariogrupos.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el usuariogrupo."
            });
        });

}

// Mostrar todas els usuariogrupos
exports.findAll = (req, res) => {
    usuariogrupos.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    usuariogrupos.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    usuariogrupos.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La usuariogrupo ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el usuariogrupo con CIF ${id}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el usuariogrupo con CIF " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    usuariogrupos.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El usuariogrupo fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el usuariogrupo con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el usuariogrupo con id " + id + "."
            });
        })
}