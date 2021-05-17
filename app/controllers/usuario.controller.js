const db = require("../models");
const Usuarios = db.usuarios;
const Op = db.Sequelize.Op;
const mail = require("./email.validation");

// Crear
exports.create = (req, res) => {

    if (mail(req.body.email) != null) {
        res.status(400).send(mail(req.body.email));
        return;
    }

    const usuario = req.body;

    Usuarios.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el Usuario."
            });
        });

}

// Mostrar todos los usuarios
exports.findAll = (req, res) => {
    Usuarios.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    Usuarios.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    Usuarios.update(req.body, {
            where: { email: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El usuario ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el usuario con dirección de correo ${id}. Compruebe la dirección o el cuerpo de la request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el usuario con dirección de correo " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    Usuarios.destroy({
            where: { email: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El usuario fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el usuario con dirección de correo ${id}. La dirección puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el usuario con dirección " + id + "."
            });
        })
}