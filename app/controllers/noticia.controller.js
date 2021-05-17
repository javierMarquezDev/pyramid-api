const db = require("../models");
const noticias = db.noticias;
const Op = db.Sequelize.Op;

//Crear noticia
exports.create = (req, res) => {

    const noticia = req.body;

    noticias.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el noticia."
            });
        });

}

// Mostrar todas els noticias
exports.findAll = (req, res) => {
    noticias.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    noticias.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    noticias.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La noticia ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el noticia con CIF ${id}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el noticia con CIF " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    noticias.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El noticia fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el noticia con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el noticia con id " + id + "."
            });
        })
}