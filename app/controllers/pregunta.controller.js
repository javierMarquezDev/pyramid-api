const db = require("../models");
const Preguntas = db.preguntas;
const encuestas = db.encuestas;
const Usuarios = db.usuarios;
const validation = require("../validation/validation")
const Op = db.Sequelize.Op;

//Crear pregunta
exports.create = async(req, res) => {

    const pregunta = req.body;

    pregunta.encuestaautor = req.params.encuestaautor;
    pregunta.encuestacodigo = req.params.encuestacodigo;

    //Validar
    const errors = await validatePregunta(pregunta);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    Preguntas.create(pregunta).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando la pregunta."
            });
        });

}

/*// Mostrar todas las preguntas
exports.findAll = (req, res) => {
    Preguntas.findAll().then(data => { res.status(200).json(data) });
};*/

// Mostrar según PK
exports.findOne = (req, res) => {
    const codigo = req.params.id;
    const encuestacodigo = req.params.encuestacodigo;
    const encuestaautor = req.params.encuestaautor;
    Preguntas.findOne({ where: { codigo: codigo, encuestacodigo: encuestacodigo, encuestaautor: encuestaautor } }).then(data => { res.status(200).json(data) });
};

// Mostrar según encuesta
exports.encuesta = (req, res) => {
    const encuestacodigo = req.params.encuestacodigo;
    const encuestaautor = req.params.encuestaautor;
    Preguntas.findAll({ where: { encuestacodigo: encuestacodigo, encuestaautor: encuestaautor } }).then(data => { res.status(200).json(data) });
};

// Modificar
exports.update = async(req, res) => {
    const codigo = req.params.id;
    const encuestacodigo = req.params.encuestacodigo;
    const encuestaautor = req.params.encuestaautor;

    //Validar
    const errors = await validatePregunta(pregunta);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    Preguntas.update(req.body, {
            where: { codigo: codigo, encuestacodigo: encuestacodigo, encuestaautor: encuestaautor }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La pregunta ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar la pregunta. Compruebe la dirección o el cuerpo de la request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando la pregunta con CIF."
            });
        });
};

// ELiminar
exports.deleteOne = (req, res) => {
    const codigo = req.params.id;
    const encuestacodigo = req.params.encuestacodigo;
    const encuestaautor = req.params.encuestaautor;

    Preguntas.destroy({ where: { codigo: codigo, encuestacodigo: encuestacodigo, encuestaautor: encuestaautor } }).then(num => {
            if (num == 1) {
                res.send({
                    message: "la pregunta fue eliminada con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse la pregunta. La información puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar la pregunta."
            });
        })
}

//VAlIDATE PREGUNTA
async function validatePregunta(pregunta) {

    var empty = true;
    var errors = {};

    for (var key in pregunta) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "codigo":
                errors[key].empty = validation.empty(pregunta[key]);
                if (validation.number(pregunta[key]) == undefined) {
                    errors[key].valid = "Tipo no válido.";
                }

            case "encuestacodigo":
            case "encuestaautor":
                errors[key].empty = validation.empty(pregunta[key]);

                //Validar si existe el proyecto
                if (validation.number(pregunta["encuestacodigo"]) == undefined) {
                    if (await encuestas.findOne({ where: { codigo: pregunta["encuestacodigo"], autor: pregunta["encuestaautor"] } }) == null)
                        errors[key].none = "La encuesta asociada no existe";
                } else {
                    errors["encuestacodigo"].format = "Tipo no válido.";
                }
                break;
            case "enunciado":
                errors[key].empty = validation.empty(pregunta[key]);
                errors[key].xtsn = validation.maxtsn(pregunta[key], 200);
                break;
            case "respuestas":
                //errors[key].empty = validation.empty(pregunta[key]);
                try { JSON.parse(pregunta[key]); } catch (e) { errors[key].valid = "No tiene un formato válido"; }
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