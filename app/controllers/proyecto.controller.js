const db = require("../models");
const proyectos = db.proyectos;
const validation = require("../validation/validation")
const Usuarios = db.usuarios;

//Crear proyecto
exports.create = async(req, res) => {

    const proyecto = req.body;

    proyecto.administrador = req.params.administrador;

    //Validar
    const errors = await validateProyecto(proyecto);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    proyectos.create(proyecto).then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el proyecto."
            });
        });

}

// Mostrar todas els proyectos
exports.findAll = (req, res) => {
    proyectos.findAll().then(data => { res.status(200).json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    proyectos.findOne({
        where: {
            codigo: req.params.id,
            administrador: req.params.administrador
        }
    }).then(data => { res.status(200).json(data) });
};

// Mostrar según administrador
exports.administrador = (req, res) => {
    proyectos.findOne({
        where: { administrador: req.params.administrador }
    }).then(data => { res.status(200).json(data) });
};

// Modificar
exports.update = async(req, res) => {

    //Validar
    const errors = await validateProyecto(req.body);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    const id = req.params.id;
    const administrador = req.params.administrador;

    proyectos.update(req.body, {
            where: { codigo: id, administrador: administrador }
        }).then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "La proyecto ha sido modificado exitosamente."
                });
            } else {
                res.status(400).send({
                    message: `No es posible modificar el proyecto con código ${id} del usuario ${administrador}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error modificando el proyecto con código ${id} del usuario ${administrador}.`
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;
    const administrador = req.params.administrador;

    proyectos.destroy({
            where: { codigo: id, administrador: administrador }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El proyecto fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No es posible modificar el proyecto con código ${id} del usuario ${administrador}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error modificando el proyecto con código ${id} del usuario ${administrador}.`
            });
        })
}

//VAlIDATE PROYECTO
async function validateProyecto(proyecto) {

    var empty = true;
    var errors = {};

    for (var key in proyecto) {
        (errors[key] == null) ? errors[key] = {}: false;
        switch (key) {
            case "administrador":
                errors[key].format = validation.empty(proyecto[key]);

                //Validar si existe el usuario
                if (await Usuarios.findByPk(proyecto[key]) == null)
                    errors[key].none = "El usuario no existe.";

                break;
            case "nombre":
                errors[key].xtsn = validation.maxtsn(proyecto[key], 30);
                break;
            case "descripcion":
                errors[key].xtsn = validation.maxtsn(proyecto[key], 200);
                break;
            case "fechahora":

                //2021-09-04T00:00:00.000+02:00

                if (isNaN(Date.parse(proyecto[key]))) {
                    errors[key].format = "No es una fecha válida."
                } else {
                    proyecto[key] = new Date(Date.parse(proyecto[key])).toISOString();
                }

                break;
            case "finalizado":
                if (typeof proyecto[key] != "boolean") {
                    errors[key].type = "Tipo de dato no válido."
                }

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