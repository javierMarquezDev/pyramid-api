const db = require("../models");
const tareas = db.tareas;
const Op = db.Sequelize.Op;
const validation = require("../validation/validation");
const Usuarios = db.usuarios;
const proyectos = db.proyectos;

//Crear tarea
exports.create = async(req, res) => {

    const tarea = req.body;

    tarea.codigoproyecto = req.params.codigoproyecto;
    tarea.administradorproyecto = req.params.administradorproyecto;


    //Validar
    const errors = await validateTarea(tarea);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    tareas.create(tarea).then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el tarea."
            });
        });

}

/*// Mostrar todas els tareas
exports.findAll = (req, res) => {
    tareas.findAll().then(data => { res.status(200).json(data) });
};*/

// Mostrar según PK
exports.findOne = (req, res) => {
    const id = req.params.id;
    const codigoproyecto = req.params.codigoproyecto;
    const administradorproyecto = req.params.administradorproyecto;
    tareas.findOne({
        where: {
            codigo: id,
            codigoproyecto: codigoproyecto,
            administradorproyecto: administradorproyecto
        }
    }).then(data => { res.status(200).json(data) });
};

// Mostrar según proyecto
exports.proyecto = (req, res) => {
    const codigoproyecto = req.params.codigoproyecto;
    const administradorproyecto = req.params.administradorproyecto;
    tareas.findAll({
        where: {
            codigoproyecto: codigoproyecto,
            administradorproyecto: administradorproyecto
        }
    }).then(data => { res.status(200).json(data) });
};



// Modificar
exports.update = async(req, res) => {
    const id = req.params.id;
    const codigoproyecto = req.params.codigoproyecto;
    const administradorproyecto = req.params.administradorproyecto;

    const tarea = req.body;

    tarea.codigoproyecto = codigoproyecto;
    tarea.administradorproyecto = administradorproyecto;

    //Validar
    const errors = await validateTarea(tarea);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    tareas.update(req.body, {
            where: {
                codigo: id,
                codigoproyecto: codigoproyecto,
                administradorproyecto: administradorproyecto
            }
        }).then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "La tarea ha sido modificada exitosamente."
                });
            } else {
                res.status(400).send({
                    message: `No es posible modificar la tarea. Compruebe la información.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando la tarea."
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;
    const codigoproyecto = req.params.codigoproyecto;
    const administradorproyecto = req.params.administradorproyecto;

    tareas.destroy({
            where: {
                codigo: id,
                codigoproyecto: codigoproyecto,
                administradorproyecto: administradorproyecto
            }
        }).then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "La tarea fue eliminada con éxito."
                });
            } else {
                res.status(400).send({
                    message: `No pudo eliminarse la tarea. La información puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar la tarea."
            });
        })
}

//VAlIDATE PROYECTOUSUARIO
async function validateTarea(tarea) {

    var empty = true;
    var errors = {};

    for (var key in tarea) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "nombre":
                errors[key].empty = validation.empty(tarea[key]);
                errors[key].xtsn = validation.maxtsn(tarea[key], 30);
                break;
            case "descripcion":
                errors[key].empty = validation.empty(tarea[key]);
                errors[key].xtsn = validation.maxtsn(tarea[key], 200);
                break;
            case "checked":
                if (typeof tarea[key] != "boolean")
                    errors[key].format = "No es un tipo válido."
                break;
            case "fechahora":

                //2021-09-04T00:00:00.000+02:00

                if (isNaN(Date.parse(tarea[key]))) {
                    errors[key].format = "No es una fecha válida."
                } else {
                    tarea[key] = new Date(Date.parse(tarea[key])).toISOString();
                }

                break;

            case "codigoproyecto":
            case "administradorproyecto":
                errors[key].empty = validation.empty(tarea[key]);

                //Validar si existe el proyecto
                if (validation.number(tarea["codigoproyecto"]) == undefined) {
                    if (await proyectos.findOne({ where: { codigo: tarea["codigoproyecto"], administrador: tarea["administradorproyecto"] } }) == null)
                        errors[key].none = "El proyecto asociado no existe";
                } else {
                    errors["codigoproyecto"].format = "Tipo no válido.";
                }
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