const db = require("../models");
const Encuestausuarios = db.encuestausuarios;
const Op = db.Sequelize.Op;

//Crear encuestausuario
exports.create = (req, res) => {

    const encuestausuario = req.body;

    Encuestausuarios.create(encuestausuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el encuestausuario."
            });
        });

}

// Mostrar según PK
exports.findOne = (req, res) => {
    Encuestausuarios.findByPk(req.params.id).then(data => { res.status(200).json(data) });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    Encuestausuarios.destroy({
            where: { id: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El encuestausuario fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el encuestausuario con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el encuestausuario con id " + id + "."
            });
        })
}