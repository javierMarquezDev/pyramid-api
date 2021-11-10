const db = require("../models");
const encuestausuarios = db.encuestausuarios;
const encuestas = db.encuestas;
//const proyectos = db.proyectos;
const usuarios = db.usuarios;
const validation = require("../validation/validation")

//Crear encuestausuario
exports.create = async(req, res) => {

    const encuestausuario = req.body;
    encuestausuario.encuestaautor = req.params.encuestaautor;
    encuestausuario.encuestacodigo = req.params.encuestacodigo;

    //Validar
    const errors = await validateEncuestausuario(encuestausuario);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    encuestausuarios.create(encuestausuario).then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error creando el encuestausuario."
            });
        });

}

// Mostrar todas els encuestausuarios
exports.findAll = (req, res) => {
    encuestausuarios.findAll().then(data => { res.status(200).json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    const encuestaautor = req.params.encuestaautor;
    const encuestacodigo = req.params.encuestacodigo;
    const encuestado = req.params.encuestado;
    encuestausuarios.findOne({
        where: {
            encuestaautor: encuestaautor,
            encuestacodigo: encuestacodigo,
            encuestado: encuestado
        }
    }).then(data => { res.status(200).json(data) });
};

// Mostrar según usuario
exports.usuario = (req, res) => {
    const encuestado = req.params.encuestado;
    encuestausuarios.findOne({
        where: {
            encuestado: encuestado
        }
    }).then(data => { res.status(200).json(data) });
};

// Mostrar según encuesta
exports.encuesta = (req, res) => {
    const encuestaautor = req.params.encuestaautor;
    const encuestacodigo = req.params.encuestacodigo;
    encuestausuarios.findOne({
        where: {
            encuestaautor: encuestaautor,
            encuestacodigo: encuestacodigo
        }
    }).then(data => { res.status(200).json(data) });
};

// Mostrar según encuestaautor
exports.encuestado = (req, res) => {
    const encuestado = req.params.encuestado;

    encuestausuarios.findAll({
        where: {
            encuestado: encuestado
        }
    }).then(data => { res.status(200).json(data) });
};

// Mostrar según encuesta
exports.encuesta = (req, res) => {
    const encuestacodigo = req.params.encuestacodigo;
    const encuestaautor = req.params.encuestaautor;

    encuestausuarios.findAll({
        where: {
            encuestacodigo: encuestacodigo,
            encuestaautor: encuestaautor
        }
    }).then(data => { res.status(200).json(data) });
};

// Modificar
exports.update = async(req, res) => {
    const encuestaautor = req.params.encuestaautor;
    const encuestacodigo = req.params.encuestacodigo;
    const encuestado = req.params.encuestado;

    //Validar
    const errors = await validateEncuestausuario(encuestausuario);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    encuestausuarios.update(req.body, {
            where: {
                encuestaautor: encuestaautor,
                encuestacodigo: encuestacodigo,
                encuestado: encuestado
            }
        }).then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "La fila ha sido modificada exitosamente."
                });
            } else {
                res.status(400).send({
                    message: `No es posible modificar la fila. Compruebe la información.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando la fila"
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const encuestaautor = req.params.encuestaautor;
    const encuestacodigo = req.params.encuestacodigo;
    const encuestado = req.params.encuestado;

    encuestausuarios.destroy({
            where: {
                encuestaautor: encuestaautor,
                encuestacodigo: encuestacodigo,
                encuestado: encuestado
            }
        }).then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "La fila fue eliminada con éxito."
                });
            } else {
                res.status(400).send({
                    message: `No pudo eliminarse la fila especificada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar la fila"
            });
        })
}

//VAlIDATE PROYECTOUSUARIO
async function validateEncuestausuario(encuestausuario) {

    var empty = true;
    var errors = {};

    for (var key in encuestausuario) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "encuestado":
                errors[key].empty = validation.empty(encuestausuario[key]);

                //Validar si existe el encuestado
                if (await usuarios.findByPk(encuestausuario[key]) == null)
                    errors[key].none = "El usuario asociado no existe";
                break;

            case "encuestacodigo":
            case "encuestaautor":
                errors[key].empty = validation.empty(encuestausuario[key]);

                //Validar si existe la encuesta
                if (validation.number(encuestausuario["encuestacodigo"]) == undefined) {
                    if (await encuestas.findOne({ where: { codigo: encuestausuario["encuestacodigo"], autor: encuestausuario["encuestaautor"] } }) == null)
                        errors[key].none = "La encuesta asociada no existe";
                } else {
                    errors["encuestacodigo"].format = "Tipo no válido.";
                }
                break;
            default:
                delete encuestausuario[key];
                break;
        }

    }

    if(encuestausuarios.findOne({where:{encuestaautor:encuestausuario.encuestaautor,encuestacodigo:encuestausuario.encuestacodigo,encuestado:encuestausuario.encuestado}}) != null)
        errors.encuestado.duplicate = "Registro duplicado";

    for (var key in errors) {
        if (JSON.stringify(errors[key]) != "{}") {
            empty = false;
            break;
        }
    }

    (empty) ? errors = null: false;
    return errors;
}