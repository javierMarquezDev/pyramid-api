const db = require("../models");
const telefonos = db.telefonos;
const Usuarios = db.usuarios;
const Empresas = db.empresas;

const validation = require("../validation/validation")
const Op = db.Sequelize.Op;

//Crear telefono
exports.create = async(req, res) => {

    const telefono = req.body;

    (req.params.usuario == undefined) ? true: telefono.usuario = req.params.usuario;
    (req.params.empresa == undefined) ? true: telefono.empresa = req.params.empresa;

    //Validar
    const errors = await validateRol(telefono);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    telefonos.create(telefono).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el teléfono."
            });
        });

}

// Mostrar todas las telefonos
exports.findAll = (req, res) => {
    telefonos.findAll().then(data => { res.status(200).json(data) });
};

// Mostrar según PK
exports.findOne = async(req, res) => {
    var numero = req.params.numero;

    telefonos.findOne({ where: { telefono: numero } }).then(data => { res.status(200).json(data) });
};

// Mostrar según usuario
exports.usuario = (req, res) => {
    const usuario = req.params.usuario;
    telefonos.findAll({ where: { usuario: usuario } }).then(data => { res.status(200).json(data) });
};

// Mostrar según empresa
exports.empresa = (req, res) => {
    const empresa = req.params.empresa;
    telefonos.findAll({ where: { empresa: empresa } }).then(data => { res.status(200).json(data) });
};


// Modificar
exports.update = async(req, res) => {
    const usuario = req.params.usuario;
    const numero = req.params.numero;

    telefonos.update(req.body, { where: { usuario: usuario, numero: numero } }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El teléfono ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el teléfono. Compruebe la dirección o el cuerpo de la request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el teléfono."
            });
        });
};

// ELiminar
exports.deleteOne = (req, res) => {
    const usuario = req.params.usuario;
    const numero = req.params.numero;

    telefonos.destroy({ where: { usuario: usuario, numero: numero } }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El teléfono fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el teléfono. La información puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el teléfono."
            });
        })
}

//VAlIDATE NOTICIA
async function validateRol(telefono) {

    var empty = true;
    var errors = {};

    for (var key in telefono) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "telefono":
                errors[key].empty = validation.empty(telefono[key]);
                errors[key].format = validation.tfn(telefono[key]);

                break;
            case "usuario":

                //Validar si existe el usuario
                if (await Usuarios.findByPk(telefono[key]) == null)
                    errors[key].none = "El usuario no existe.";

                break;

            case "empresa":

                //Validar si existe la empresa
                if (await Empresas.findByPk(telefono[key]) == null)
                    errors[key].none = "La empresa no existe.";

                break;

            default:
                break;
        }
        if (validation.empty(telefono["empresa"]) != null && validation.empty(telefono["usuario"]) != null) {
            errors["usuario"].empty = "Ambos campos no pueden estar vacíos.";
            errors["empresa"].empty = "Ambos campos no pueden estar vacíos.";
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