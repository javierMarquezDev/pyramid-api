const db = require("../models");
const mensaje = require("../models/mensaje");
const Mensajes = db.mensajes;

const usuarios = db.usuarios;
const validation = require("../validation/validation")
const Op = db.Sequelize.Op;

//Crear mensaje
exports.create = async(req, res) => {

    const mensaje = req.body;

    mensaje.remitente = req.params.sender;
    mensaje.destinatario = req.params.receiver;

    //Validar
    const errors = await validateMensaje(mensaje);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    Mensajes.create(mensaje).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando la mensaje."
            });
        });

}

/*// Mostrar todas las mensajes
exports.findAll = (req, res) => {
    Mensajes.findAll().then(data => { res.status(200).json(data) });
};*/

// Mostrar según PK
exports.findOne = (req, res) => {
    const codigo = req.params.id;
    const receiver = req.params.receiver;
    const sender = req.params.sender;
    Mensajes.findOne({ where: { codigo: codigo, destinatario: receiver, remitente: sender } }).then(data => { res.status(200).json(data) });
};

// Mostrar según destinatario y remitente
exports.findAll = (req, res) => {
    const receiver = req.params.receiver;
    const sender = req.params.sender;
    Mensajes.findAll({ where: { destinatario: receiver, remitente: sender } }).then(data => { res.status(200).json(data) });
};

// Mostrar una conversación
exports.conversation = async(req, res) => {

    const receiver = req.params.usuario1;
    const sender = req.params.usuario2;
    Mensajes.findAll({
        where: {
            [Op.or]: [{
                    destinatario: receiver,
                    remitente: sender
                },
                {
                    destinatario: sender,
                    remitente: receiver
                }
            ]
        }
    }).then(data => { res.status(200).json(data) });
};

// Mostrar enviados
exports.sent = (req, res) => {
    const sender = req.params.sender;
    Mensajes.findAll({ where: { remitente: sender } }).then(data => { res.status(200).json(data) });
};

// Mostrar recibidos
exports.received = (req, res) => {
    const receiver = req.params.receiver;
    Mensajes.findAll({ where: { destinatario: receiver } }).then(data => { res.status(200).json(data) });
};

// Modificar
exports.update = async(req, res) => {
    const codigo = req.params.id;
    const receiver = req.params.receiver;
    const sender = req.params.sender;

    //Validar
    const errors = await validateMensaje(mensaje);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    Mensajes.update(req.body, {
            where: { codigo: codigo, destinatario: receiver, remitente: sender }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La mensaje ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar la mensaje. Compruebe la dirección o el cuerpo de la request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando la mensaje con CIF."
            });
        });
};

// ELiminar
exports.deleteOne = (req, res) => {
    const codigo = req.params.id;
    const receiver = req.params.receiver;
    const sender = req.params.sender;

    Mensajes.destroy({ where: { codigo: codigo, destinatario: receiver, remitente: sender } }).then(num => {
            if (num == 1) {
                res.send({
                    message: "la mensaje fue eliminada con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse la mensaje. La información puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar la mensaje."
            });
        })
}

//VAlIDATE MENSAJE
async function validateMensaje(mensaje) {

    var empty = true;
    var errors = {};

    for (var key in mensaje) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "codigo":
                errors[key].empty = validation.empty(mensaje[key]);
                if (validation.number(mensaje[key]) == undefined) {
                    errors[key].valid = "Tipo no válido.";
                }

            case "remitente":
            case "destinatario":
                errors[key].empty = validation.empty(mensaje[key]);

                //Validar si existe el usuario

                if (await usuarios.findOne({ where: { email: mensaje[key] } }) == null)
                    errors[key].none = "El usuario asociado no existe";
                break;
            case "fechahora":
                //2021-09-04T00:00:00.000+02:00

                if (isNaN(Date.parse(mensaje[key]))) {
                    errors[key].format = "No es una fecha válida."
                } else {
                    mensaje[key] = new Date(Date.parse(mensaje[key])).toISOString();
                }

                break;
            case "texto":
                errors[key].empty = validation.empty(mensaje[key]);
                errors[key].xtsn = validation.maxtsn(mensaje[key], 1000);
                break;
            case "imagen":
                errors[key].xtsn = validation.maxtsn(mensaje[key], 32000);
                break;

            default:
                break;
        }
    }

    let empties = [];

    for (var key in errors) {
        if (JSON.stringify(errors[key]) != "{}") {
            empty = false;
        }else{
            empties.push(key);
        }
    }

    empties.forEach(element => {
        delete errors[element];
        
    });

    (empty) ? errors = null: false;
    return errors;
}