const { grupos } = require("../models");
const db = require("../models");
const tareas = db.tareas;
const Op = db.Sequelize.Op;
const validation = require("../validation/validation");
const Usuarios = db.usuarios;
const proyectos = db.proyectos;

//Crear tarea
exports.create = async(req, res) => {

    const tarea = req.body;

    tarea.grupocodigo = req.params.grupocodigo;
    tarea.grupoempresa = req.params.grupoempresa;


    //Validar
    const errors = await validateTarea(tarea);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    tareas.create(tarea).then(data => {
            res.status(201).send({
                message: "Tarea creada con éxito."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando la tarea."
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
    const grupocodigo = req.params.grupocodigo;
    const grupoempresa = req.params.grupoempresa;
    tareas.findOne({
        where: {
            codigo: id,
            grupocodigo: grupocodigo,
            grupoempresa: grupoempresa
        }
    }).then(data => { res.status(200).json(data) });
};

// Mostrar según proyecto
exports.proyecto = (req, res) => {
    const grupocodigo = req.params.grupocodigo;
    const grupoempresa = req.params.grupoempresa;
    tareas.findAll({
        where: {
            grupocodigo: grupocodigo,
            grupoempresa: grupoempresa
        }
    }).then(data => { res.status(200).json(data) });
};

// Mostrar según usuario
exports.usuario = (req, res) => {
    const usuario = req.params.usuario;
    tareas.findAll({
        where: {
            usuario: usuario
        }
    }).then(data => { res.status(200).json(data) });
};



// Modificar
exports.update = async(req, res) => {
    const id = req.params.id;
    const grupocodigo = req.params.grupocodigo;
    const grupoempresa = req.params.grupoempresa;

    const tarea = req.body;

    tarea.grupocodigo = grupocodigo;
    tarea.grupoempresa = grupoempresa;

    //Validar
    const errors = await validateTarea(tarea);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    tareas.update(req.body, {
            where: {
                codigo: id,
                grupocodigo: grupocodigo,
                grupoempresa: grupoempresa
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
    const grupocodigo = req.params.grupocodigo;
    const grupoempresa = req.params.grupoempresa;

    tareas.destroy({
            where: {
                codigo: id,
                grupocodigo: grupocodigo,
                grupoempresa: grupoempresa
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
            case "usuario":
                errors[key].empty = validation.empty(tarea[key]);

                if (await Usuarios.findByPk(tarea[key]) == null)
                    errors[key].none = "El usuario no existe";
                break;
            case "fechahora":

                //2021-09-04T00:00:00.000+02:00

                if (isNaN(Date.parse(tarea[key]))) {
                    errors[key].format = "No es una fecha válida."
                } else {
                    tarea[key] = new Date(Date.parse(tarea[key])).toISOString();
                }

                break;

            case "grupocodigo":
            case "grupoempresa":
                errors[key].empty = validation.empty(tarea[key]);

                //Validar si existe el proyecto
                if(validation.cif(tarea["grupoempresa"]) == true){

                    if (validation.number(tarea["grupocodigo"]) == undefined) {
                        if (await grupos.findOne({ where: { codigo: tarea["grupocodigo"], empresa: tarea["grupoempresa"] } }) == null)
                            errors[key].none = "El grupo asociado no existe";
                    } else {
                        
                        errors["grupocodigo"].format = "Tipo no válido";
                        
                    }

                }else{
                    errors["grupoempresa"].format = "CIF no válido";
                }

                
                break;
            default:
                delete tarea[key];
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