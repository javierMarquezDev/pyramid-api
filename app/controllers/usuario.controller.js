const db = require("../models");
const Usuarios = db.usuarios;
const validation = require("../validation/validation");

// Crear
exports.create = async(req, res) => {

    //Validar
    const errors = await validateUsuario(req.body);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    const usuario = req.body;

    //BD
    Usuarios.create(usuario).then(data => {
            res.status(201).send({
                message: "Usuario creado con éxito."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el Usuario."
            });
        });

}

// Mostrar todos los usuarios
exports.findAll = (req, res) => {
    Usuarios.findAll().then(data => { res.status(200).json(data) });
};

// Mostrar según PK
exports.findOne = async(req, res) => {
    try {

        await Usuarios.findByPk(req.params.id).then(data => {
            console.log(data.dataValues);
            res.status(200).json(data);
        });

    } catch (UnhandledPromiseRejectionWarning) {
        res.status(400).json({ error: "Usuario no encontrado" });
    }

};

// Mostrar según rol
exports.rol = (req, res) => {
    Usuarios.findAll({ where: { rol: req.params.rol } }).then(data => { res.status(200).json(data) });
};

// Modificar
exports.update = async(req, res) => {

    //Validar
    const errors = await validateUsuario(req.body);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    //BD
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
                    message: `No es posible modificar el usuario con dirección de correo ${id}.` +
                        `Compruebe la dirección o el cuerpo de la request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el usuario con dirección de correo " + id + ". " + err
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

//Añadir notificaciones
exports.addNotification = async(req, res) => {
    const id = req.params.id;
    const notificacion = req.body;

    console.log(req.body);

    var notificaciones = await Usuarios.findByPk(id).then(data => { return data.dataValues.notificaciones });

    notificacionArray = Array.from(notificaciones);

    notificacionArray.push(notificacion);

    const body = { "notificaciones": notificacionArray };

    Usuarios.update(
            body, {
                where: { email: id }
            }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La notificación ha sido añadida exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible añadir la notificación.` +
                        `Compruebe la dirección o el cuerpo de la request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando la notificación con dirección de correo. " + err
            });
        });
}

//Eliminar notificaciones


async function validateUsuario(usuario) {
    var empty = true;
    var errors = {};
    for (var key in usuario) {
        (errors[key] == null) ? errors[key] = {}: false;
        switch (key) {
            case "email":
                errors.email.empty = validation.empty(usuario[key]);
                errors.email.xtsn = validation.maxtsn(usuario[key], 50);
                errors.email.format = validation.email(usuario[key]);
                var duplicateEmail = await Usuarios.findByPk(usuario.email);
                (duplicateEmail == null) ? false: errors.email.unique = "El email debe ser único";
                break;
            case "contrasena":
                errors[key].empty = validation.empty(usuario[key]);
                errors[key].xtsn = validation.maxtsn(usuario[key], 30);
                if (errors[key].empty == undefined && errors[key].xtsn == undefined) {
                    usuario[key] = Usuarios.generateHash(usuario[key]);
                }
                break;
            case "nombre":
            case "apellido1":
            case "apellido2":
                errors[key].valid = validation.humanname(usuario[key]);
                errors[key].xtsn = validation.maxtsn(usuario[key], 35);
                (key != "apellido2") ? errors[key].empty = validation.empty(usuario[key]): false;
                break;
            case "dni":
                errors.dni.empty = validation.empty(usuario[key]);
                errors.dni.valid = validation.dni(usuario[key]);
                var duplicateDni = await Usuarios.findOne({ where: { dni: usuario.dni } });
                (duplicateDni == null) ? false: errors.dni.unique = "El dni debe ser único";
                break;
            case "tipovia":
                errors.tipovia.empty = validation.empty(usuario[key]);
                errors.tipovia.valid = validation.tipovia(usuario[key]);
                break;
            case "nombrevia":
                errors[key].empty = validation.empty(usuario[key]);
                errors[key].valid = validation.humanname(usuario[key]);
                break;
            case "numvia":
                errors[key].empty = validation.empty(usuario[key]);
                errors[key].valid = validation.regex(usuario[key], /^\w*$/);
                break;
            case "codigopuerta":
                errors[key].max = validation.maxtsn(usuario[key], 5);
                errors[key].min = validation.mnxtsn(usuario[key], 1);
                errors[key].valid = validation.regex(usuario[key], /^\w*?(º|ª)?\w*?$/);
                break;
            case "notificaciones":
                errors[key].valid = validation.jsobject(usuario[key]);
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