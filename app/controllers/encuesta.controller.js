const { encuestas } = require("../models");
const db = require("../models");
const Encuestas = db.encuestas;
const Usuarios = db.usuarios;
const validation = require("../validation/validation")
const Op = db.Sequelize.Op;

//Crear encuesta
exports.create = async(req, res) => {

    const encuesta = req.body;

    encuesta.autor = req.params.autor;

    //Validar
    const errors = await validateEncuesta(encuesta);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    Encuestas.create(encuesta).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando la encuesta."
            });
        });

}

// Mostrar todas las encuestas
exports.findAll = (req, res) => {
    Encuestas.findAll().then(data => { res.status(200).json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    const codigo = req.params.id;
    const autor = req.params.autor;
    Encuestas.findOne({ where: { codigo: codigo, autor: autor } }).then(data => { res.status(200).json(data) });
};

// Mostrar según autor
exports.usuario = (req, res) => {
    const autor = req.params.autor;
    Encuestas.findAll({ where: { autor: autor } }).then(data => { res.status(200).json(data) });
};

// Modificar
exports.update = async(req, res) => {
    const codigo = req.params.id;
    const autor = req.params.autor;
    req.body.codigo = codigo;
    req.body.autor = autor;

    //Validar
    const errors = await validateEncuesta(req.body);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    Encuestas.update(req.body, {
            where: { codigo: codigo, autor: autor }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La encuesta ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar la encuesta. Compruebe la dirección o el cuerpo de la request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando la encuesta con CIF."
            });
        });
};

// ELiminar
exports.deleteOne = (req, res) => {
    const codigo = req.params.id;
    const autor = req.params.autor;

    Encuestas.destroy({ where: { codigo: codigo, autor: autor } }).then(num => {
            if (num == 1) {
                res.send({
                    message: "la encuesta fue eliminada con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse la encuesta. La información puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar la encuesta."
            });
        })
}

//VAlIDATE GRUPO
async function validateEncuesta(encuesta) {

    var empty = true;
    var errors = {};

    for (var key in encuesta) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "autor":
                errors[key].empty = validation.empty(encuesta[key]);

                //Validar si existe el usuario
                if (await Usuarios.findByPk(encuesta[key]) == null)
                    errors[key].none = "El usuario asociado no existe";
                break;

            case "nombre":
                errors[key].empty = validation.empty(encuesta[key]);
                errors[key].xtsn = validation.maxtsn(encuesta[key], 30);
                break;
            case "descripcion":
                errors[key].empty = validation.empty(encuesta[key]);
                errors[key].xtsn = validation.maxtsn(encuesta[key], 200);
                break;
            default:
                delete encuesta[key]
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