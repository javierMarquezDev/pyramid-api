const db = require("../models");
const Archivos = db.archivos;
const Tareas = db.tareas;
const Proyectos = db.proyectos;
const Usuarios = db.usuarios;
const validation = require("../validation/validation");

//Crear archivo
exports.create = (req, res) => {

    const archivo = req.body;

    Archivos.create(usuario).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el archivo."
            });
        });

}

// Mostrar todas els archivos
exports.findAll = (req, res) => {
    Archivos.findAll().then(data => { res.json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    Archivos.findByPk(req.params.id).then(data => { res.json(data) });
};

// Modificar
exports.update = (req, res) => {
    const id = req.params.id;

    Archivos.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La archivo ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el archivo con CIF ${id}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el archivo con CIF " + id + "."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    Archivos.destroy({
            where: { nif: id }
        }).then(num => {
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
function validateArchivo(archivo) {

    var empty = true;
    var errors = {};

    for (var key in archivo) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "tareacodigo":
            case "tareacodigoproyecto":

                //Validar si existe tarea
                if (Tareas.findOne({
                        where: {
                            codigo: archivo["tareacodigo"],
                            codigoproyecto: archivo["tareacodigoproyecto"],
                            administradorproyecto: archivo["tareaadministradorproyecto"]
                        }
                    }) == null)
                    errors[key].none = "La tarea asociada no existe o el código es incorrecto.";

                break;
            case "maxsizekb":
                errors[key].valid = validation.number(archivo[key]);
                errors[key].minimum = validation.compare(archivo[key]);
                break;
            case "administrador":
                errors[key].format = validation.email(archivo[key]);

                //Validar si existe usuario
                if (Usuarios.findByPk(archivo[key]) == null)
                    errors[key].none = "El usuario no existe.";

                break;
            case "nombrevia":
                errors[key].empty = validation.empty(archivo[key]);
                errors[key].valid = validation.humanname(archivo[key]);
                break;
            case "numvia":
                errors[key].empty = validation.empty(archivo[key]);
                errors[key].valid = validation.regex(archivo[key], /^\w*$/);
                break;
            case "codigopuerta":
                errors[key].max = validation.maxtsn(archivo[key], 5);
                errors[key].min = validation.mnxtsn(archivo[key], 1);
                errors[key].valid = validation.regex(archivo[key], /^\w*?(º|ª)?\w*?$/);
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