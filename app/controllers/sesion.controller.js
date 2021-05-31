const db = require("../models");
const sesion = require("../models/sesion");
const sesions = db.sesiones;
const Usuarios = db.usuarios;

const validation = require("../validation/validation")
const Op = db.Sequelize.Op;

//Crear sesion
exports.create = async(req, res) => {

    const sesion = req.body;

    sesion.usuario = req.params.usuario;

    //Validar
    const errors = await validateRol(sesion);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    sesions.create(sesion).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando la sesión."
            });
        });

}

// Mostrar todas las sesions
exports.findAll = (req, res) => {
    sesions.findAll().then(data => { res.status(200).json(data) });
};

// Mostrar según PK
exports.findOne = async(req, res) => {
    const usuario = req.params.usuario;
    var codigo = req.params.codigo;

    sesions.findOne({ where: { usuario: usuario, codigo: codigo } }).then(data => { res.status(200).json(data) });
};

// Mostrar según usuario
exports.usuario = (req, res) => {
    const usuario = req.params.usuario;
    sesions.findAll({ where: { usuario: usuario } }).then(data => { res.status(200).json(data) });
};


// Modificar
exports.update = async(req, res) => {
    const usuario = req.params.usuario;
    const codigo = req.params.codigo;

    sesions.update(req.body, { where: { usuario: usuario, codigo: codigo } }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La sesión ha sido modificada exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar la sesión. Compruebe la dirección o el cuerpo de la request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando la sesión."
            });
        });
};

// ELiminar
exports.deleteOne = (req, res) => {
    const usuario = req.params.usuario;
    const codigo = req.params.codigo;

    sesions.destroy({ where: { usuario: usuario, codigo: codigo } }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La sesión fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse la sesión. La información puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar la sesión."
            });
        })
}

//VAlIDATE NOTICIA
async function validateRol(sesion) {

    var empty = true;
    var errors = {};

    for (var key in sesion) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "codigo":
                if (validation.number(sesion["codigo"]) != undefined)
                    errors["codigo"].format = "Tipo no válido.";

                break;
            case "usuario":
                errors[key].format = validation.empty(sesion[key]);

                //Validar si existe el usuario
                if (await Usuarios.findByPk(sesion[key]) == null)
                    errors[key].none = "El usuario no existe.";

                break;
            case "horainicio":
                errors[key].empty = validation.empty(sesion[key]);

                //2021-09-04T00:00:00.000+02:00

                if (isNaN(Date.parse(sesion[key]))) {
                    errors[key].format = "No es una fecha válida."
                } else {
                    sesion[key] = new Date(Date.parse(sesion[key])).toISOString();
                }

                break;
            case "horafin":

                //2021-09-04T00:00:00.000+02:00

                if (isNaN(Date.parse(sesion[key]))) {
                    errors[key].format = "No es una fecha válida."
                } else {
                    sesion[key] = new Date(Date.parse(sesion[key])).toISOString();
                }

                break;

            default:
                break;
        }
    }

    for (var key in errors) {
        if (JSON.stringify(errors[key]) != "{}") {
            empty = false;
            break;
        }
    }

    (empty) ? errors = null: false;
    return errors;
}