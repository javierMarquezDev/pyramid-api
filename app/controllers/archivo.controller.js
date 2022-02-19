const db = require("../models");
const Archivos = db.archivos;
const Tareas = db.tareas;
const validation = require("../validation/validation");
const fileext = require("../models/fileext.enum");
const myLogger = require("../log/logger");

//Crear archivo
exports.create = async(req, res) => {

    const archivo = req.body;

    //Validar
    const errors = await validateArchivo(archivo);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    myLogger.log(archivo);

    Archivos.create(archivo).then(data => {
            res.status(201).send({
                message: "Archivo creado con éxito."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error creando el archivo."
            });
        });

}

// Mostrar todas els archivos
exports.findAll = (req, res) => {
    Archivos.findAll().then(data => { res.status(200).json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    Archivos.findOne({where: {codigo: req.params.codigo,
    tareacodigo: req.params.tareacodigo,
    tareagrupocodigo: req.params.tareagrupocodigo,
    tareagrupoempresa: req.params.tareagrupoempresa}}).then(data => { res.status(200).json(data) });
};

// Mostrar según tarea
exports.findByTarea = (req, res) => {
    Archivos.findOne({where: {
    tareacodigo: req.params.tareacodigo,
    tareagrupocodigo: req.params.tareagrupocodigo,
    tareagrupoempresa: req.params.tareagrupoempresa}}).then(data => { res.status(200).json(data) });
};

// Modificar//
exports.update = async(req, res) => {
    const id = req.params.id;

    const archivo = req.body;

    //Validar
    const errors = await validateArchivo(archivo);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    Archivos.update(req.body, {where: {codigo: req.params.codigo,
        tareacodigo: req.params.tareacodigo,
        tareagrupocodigo: req.params.tareagrupocodigo,
        tareagrupoempresa: req.params.tareagrupoempresa}}).then(num => {
            if (num == 1) {
                res.send({
                    message: "El archivo ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el archivo con código ${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el archivo con código " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    Archivos.destroy({where: {codigo: req.params.codigo,
        tareacodigo: req.params.tareacodigo,
        tareagrupocodigo: req.params.tareagrupocodigo,
        tareagrupoempresa: req.params.tareagrupoempresa}}).then(num => {
            if (num == 1) {
                res.send({
                    message: "El archivo fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el archivo con id ${id}. La id puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el archivo con id " + id + "."
            });
        })
}

//VAlIDATE ARCHIVO
async function validateArchivo(archivo) {

    var empty = true;
    var errors = {};

    for (var key in archivo) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "tareacodigo":
            case "tareagrupocodigo":
            case "tareagrupoempresa":

                //Validar si existe tarea
                if (await Tareas.findOne({
                        where: {
                            codigo: archivo["tareacodigo"],
                            grupocodigo: archivo["tareagrupocodigo"],
                            grupoempresa: archivo["tareagrupoempresa"]
                        }
                    }) == null)
                    errors[key].none = "La tarea asociada no existe o la identificación es incorrecta.";

                break;
            case "archivo":
                errors[key].xtsn = validation.maxtsn(archivo[key], 64000);
                break;
            case "maxsizekb":
                errors[key].valid = validation.number(archivo[key]);
                errors[key].minimum = validation.compare(archivo[key]);
                break;
            case "fileextletters":

                errors[key].format = validation.maxtsn(archivo[key],4);

                if (validation.contenidoEn(archivo[key], fileext))
                    errors[key].fileext = "No es una extensión de archivo válida.";

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