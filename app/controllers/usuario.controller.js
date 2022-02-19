const { json } = require('body-parser');
const myLogger = require('../log/logger');
const Logger = require('../log/logger');
const db = require("../models");
const Usuarios = db.usuarios;
const validation = require("../validation/validation");
const Rolusuarios = db.rolusuarios;

// Crear
exports.create = async(req, res) => {

    //Validar
    const errors = await validateUsuario(req.body);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    const usuario = req.body;

    Logger.log(usuario);

    //BD
    Usuarios.create(usuario).then(data => {
        res.status(201).send({
            message: "Usuario creado con éxito."
        });    
        })
        .catch(err => {
            res.status(500).send({
                message: "Error creando el Usuario.",
                error: err
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
                    message: `No es posible modificar el usuario con dirección de correo ${id}.`
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

//Obtener notificaciones
exports.getNotification = async(req,res) => {
    const ntfs = await Usuarios.findByPk(req.params.id).then(data => {
        if(data != null) return data.dataValues.notificaciones;
    })

    res.status(200).json(ntfs);
}

//Obtener notificaciones
exports.getOneNotification = async(req,res) => {
    const ntfs = await Usuarios.findByPk(req.params.id).then(data => {
        if(data != null) return data.dataValues.notificaciones;
    })
    let ntf = null;
    ntfs.forEach(element => {
        if(element.codigo==req.params.notificacion)
            ntf = element
    });
    res.status(200).json(ntf);
}

//Añadir notificaciones
exports.addNotification = async(req, res) => {
    const id = req.params.id;
    const notificacion = req.body;

    console.log(notificacion);

    await Usuarios.findByPk(id).then(data => { 
        notificaciones = data.dataValues.notificaciones;

        notificacionArray = Array.from(notificaciones);

        switch (notificacionArray.length){
            case 0:
                notificacion.codigo = 1;
                break;
            default:
                notificacion.codigo = notificacionArray[notificacionArray.length - 1].codigo + 1;
                break;
        }
        

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
    
    });

    

    
}

//Eliminar notificaciones
exports.removeNotification = async(req, res) => {
    const id = req.params.id;
    const notificacion = req.params.notificacion;

    var notificaciones = await Usuarios.findByPk(id).then(data => data.dataValues.notificaciones) 

    var i = 0;
    var found = -1;

    notificaciones.forEach(element => {
        myLogger.log(element);
        if (element.codigo == notificacion) { found = i;}
        i++;
    });
    if (found >= 0) {
        notificaciones.splice(found, 1);
    }

    const body = { "notificaciones": notificaciones };

    Usuarios.update(
            body, {
                where: { email: id }
            }).then(num => {
            if (num == 1) {
                res.send((found>=0)?{message:"La notificación fue eliminada exitosamente."}:{message:"La notificación no pudo encontrase."});
            } else {
                res.send({
                    message: `No es posible eliminar la notificación.` +
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
                (duplicateEmail == null) ? false: errors.email.unique = "El email ya existe.";
                break;
            case "contrasena":
                errors[key].empty = validation.empty(usuario[key]);

                const usuarioBd = await Usuarios.findOne({where: {dni:usuario.dni}}).then(data =>data);


                Logger.log(usuarioBd);
                if(usuarioBd != null && usuarioBd.contrasena === usuario.contrasena){
                    usuario.contrasena = undefined;
                    break;
                }

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

                var duplicateDni = await Usuarios.findAll({ where: { dni: usuario[key] } }).then((data)=>data);

                if(duplicateDni.length != undefined && duplicateDni.length >= 2){
                    errors.dni.unique = "El dni ya existe.";
                    break;
                }

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
                if(usuario[key] != undefined){
                    errors[key].valid = validation.jsobject(usuario[key]);
                    break;
                }else{
                    usuario[key] = {};
                }                

            default:
                delete usuario[key];
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