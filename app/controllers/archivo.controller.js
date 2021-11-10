const db = require("../models");
const Archivos = db.archivos;
const Tareas = db.tareas;
const validation = require("../validation/validation");
const fileext = require("../models/fileext.enum");

//Crear archivo
exports.create = async(req, res) => {

    const archivo = req.body;

    //Validar
    const errors = await validateArchivo(archivo);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    Archivos.create(usuario).then(data => {
            res.status(201).send(data);
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
    Archivos.findByPk(req.params.id).then(data => { res.status(200).json(data) });
};

// Modificar
exports.update = async(req, res) => {
    const id = req.params.id;

    const archivo = req.body;

    //Validar
    const errors = await validateArchivo(archivo);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

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
async function validateArchivo(archivo) {

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
            case "archivo":
                errors[key].xtsn = validation.maxtsn(mensaje[key], 64000);
                var duplicate = await Archivos.findOne({ where: { archivo: archivo.archivo } });
                (duplicate == null) ? false: errors[key].unique = "El dato debe ser único";
                break;
            case "maxsizekb":
                errors[key].valid = validation.number(archivo[key]);
                errors[key].minimum = validation.compare(archivo[key]);
                break;
            case "fileextletters":
                errors[key].format = validation.email(archivo[key]);

                if (!validation.contenidoEn(archivo[key], fileext))
                    errors[key].fileext = "No es una extensión de archivo válida.";

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