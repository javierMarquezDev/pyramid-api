const db = require("../models");
const usuariotarea = require("../models/usuariotarea");
//const tarea = require("../models/tarea");
const usuariotareas = db.usuariotareas;
const tareas = db.tareas;
const usuarios = db.usuarios;
const validation = require("../validation/validation")

//Crear usuariotarea
exports.create = async(req, res) => {

    const usuariotarea = req.body;
    usuariotarea.tareaadministradorproyecto = req.params.tareaadministradorproyecto;
    usuariotarea.tareacodigoproyecto = req.params.tareacodigoproyecto;
    usuariotarea.tareacodigo = req.params.tareacodigo;

    //Validar
    const errors = await validateUsuariotarea(usuariotarea);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    usuariotareas.create(usuariotarea).then(data => {
            res.status(201).send({
                message: "Tarea asignada con éxito."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el usuariotarea."
            });
        });

}

// Mostrar todas las filas
exports.findAll = (req, res) => {
    usuariotareas.findAll().then(data => { res.status(200).json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {

    if(isNaN(req.params.tareacodigoproyecto) || isNaN(req.params.tareacodigo)) res.status(404).send({message:"Parámetro no válido."});

    const atareado = req.params.atareado;
    const tareaadministradorproyecto = req.params.tareaadministradorproyecto;
    const tareacodigoproyecto = req.params.tareacodigoproyecto;
    const tareacodigo = req.params.tareacodigo;

    usuariotareas.findOne({
        where: {
            atareado: atareado,
            tareaadministradorproyecto: tareaadministradorproyecto,
            tareacodigoproyecto: tareacodigoproyecto,
            tareacodigo: tareacodigo
        }
    }).then(data => { res.status(200).json(data) });
};

// Mostrar según usuario
exports.usuario = (req, res) => {
    const atareado = req.params.atareado;

    usuariotareas.findAll({
        where: {
            atareado: atareado
        }
    }).then(data => { res.status(200).json(data) });
};

// Mostrar según tarea
exports.tarea = (req, res) => {

    if(isNaN(req.params.tareacodigoproyecto) || isNaN(req.params.tareacodigo)) res.status(404).send({message:"Parámetro no válido."});

    const tareaadministradorproyecto = req.params.tareaadministradorproyecto;
    const tareacodigoproyecto = req.params.tareacodigoproyecto;
    const tareacodigo = req.params.tareacodigo;

    usuariotareas.findAll({
        where: {
            tareaadministradorproyecto: tareaadministradorproyecto,
            tareacodigoproyecto: tareacodigoproyecto,
            tareacodigo: tareacodigo
        }
    }).then(data => { res.status(200).json(data) });
};

// Modificar
exports.update = async(req, res) => {

    if(isNaN(req.params.tareacodigoproyecto) || isNaN(req.params.tareacodigo)) res.status(404).send({message:"Parámetro no válido."});

    const atareado = req.params.atareado;
    const tareaadministradorproyecto = req.params.tareaadministradorproyecto;
    const tareacodigoproyecto = req.params.tareacodigoproyecto;
    const tareacodigo = req.params.tareacodigo;
    var usuariotarea = req.body;
    usuariotarea.tareaadministradorproyecto = tareaadministradorproyecto;
    usuariotarea.tareacodigoproyecto = tareacodigoproyecto;
    usuariotarea.tareacodigo = tareacodigo;

    //Validar
    const errors = await validateUsuariotarea(usuariotarea);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    usuariotareas.update(usuariotarea, {
            where: {
                atareado: atareado,
                tareaadministradorproyecto: tareaadministradorproyecto,
                tareacodigoproyecto: tareacodigoproyecto,
                tareacodigo: tareacodigo
            }
        }).then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "La fila ha sido modificado exitosamente."
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

    if(isNaN(req.params.tareacodigoproyecto) || isNaN(req.params.tareacodigo)) res.status(404).send({message:"Parámetro no válido."});

    const atareado = req.params.atareado;
    const tareaadministradorproyecto = req.params.tareaadministradorproyecto;
    const tareacodigoproyecto = req.params.tareacodigoproyecto;
    const tareacodigo = req.params.tareacodigo;

    usuariotareas.destroy({
            where: {
                atareado: atareado,
                tareaadministradorproyecto: tareaadministradorproyecto,
                tareacodigoproyecto: tareacodigoproyecto,
                tareacodigo: tareacodigo
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

//VAlIDATE USUARIOTAREA
async function validateUsuariotarea(usuariotarea) {

    var empty = true;
    var errors = {};

    for (var key in usuariotarea) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "atareado":
                errors[key].empty = validation.empty(usuariotarea[key]);

                //Validar si existe el usuario
                if (await usuarios.findByPk(usuariotarea[key]) == null)
                    errors[key].none = "El usuario asociado no existe";
                break;

            case "tareacodigo":
            case "tareacodigoproyecto":
            case "tareaadministradorproyecto":
                errors[key].empty = validation.empty(usuariotarea[key]);

                //Validar si existe la tarea
                if (validation.number(usuariotarea["tareacodigo"]) == undefined || validation.number(usuariotarea["tareacodigo"]) == undefined) {
                    if (await tareas.findOne({ where: { codigo: usuariotarea["tareacodigo"], codigoproyecto: usuariotarea["tareacodigoproyecto"], administradorproyecto: usuariotarea["tareaadministradorproyecto"] } }) == null)
                        errors[key].none = "La tarea asociada no existe";
                } else {
                    errors[key].format = "Tipo no válido.";
                }
                break;
            default:
                delete usuariotarea[key];
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