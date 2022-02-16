const db = require("../models");
const proyectousuarios = db.proyectousuarios;
const proyectos = db.proyectos;
const usuarios = db.usuarios;
const validation = require("../validation/validation")

//Crear proyectousuario
exports.create = async(req, res) => {

    const proyectousuario = req.body;
    proyectousuario.proyectocodigo = req.params.proyectocodigo;
    proyectousuario.proyectoadministrador = req.params.proyectoadministrador;

    //Validar
    const errors = await validateProyectousuario(proyectousuario);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    proyectousuarios.create(proyectousuario).then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el proyectousuario."
            });
        });

}

// Mostrar todas els proyectousuarios
exports.findAll = (req, res) => {
    proyectousuarios.findAll().then(data => { res.status(200).json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    const usuario = req.params.usuario;
    const proyectocodigo = req.params.proyectocodigo;
    const proyectoadministrador = req.params.proyectoadministrador;
    proyectousuarios.findOne({
        where: {
            usuario: usuario,
            proyectocodigo: proyectocodigo,
            proyectoadministrador: proyectoadministrador
        }
    }).then(data => { res.status(200).json(data) });
};

// Mostrar según usuario
exports.usuario = (req, res) => {
    const usuario = req.params.usuario;

    proyectousuarios.findAll({
        where: {
            usuario: usuario
        }
    }).then(data => { res.status(200).json(data) });
};

// Mostrar según proyecto
exports.proyecto = (req, res) => {
    const proyectocodigo = req.params.proyectocodigo;
    const proyectoadministrador = req.params.proyectoadministrador;

    proyectousuarios.findAll({
        where: {
            proyectocodigo: proyectocodigo,
            proyectoadministrador: proyectoadministrador
        }
    }).then(data => { res.status(200).json(data) });
};

// Modificar
exports.update = async(req, res) => {
    const usuario = req.params.usuario;
    const proyectocodigo = req.params.proyectocodigo;
    const proyectoadministrador = req.params.proyectoadministrador;
    var proyectousuario = req.body;
    proyectousuario.usuario = usuario;
    proyectousuario.proyectocodigo = proyectocodigo;
    proyectousuario.proyectoadministrador = proyectoadministrador;

    //Validar
    const errors = await validateProyectousuario(proyectousuario);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    proyectousuarios.update(req.body, {
            where: {
                usuario: usuario,
                proyectocodigo: proyectocodigo,
                proyectoadministrador: proyectoadministrador
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
    const usuario = req.params.usuario;
    const proyectocodigo = req.params.proyectocodigo;
    const proyectoadministrador = req.params.proyectoadministrador;

    proyectousuarios.destroy({
            where: {
                usuario: usuario,
                proyectocodigo: proyectocodigo,
                proyectoadministrador: proyectoadministrador
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

//VAlIDATE PROYECTOUSUARIO
async function validateProyectousuario(proyectousuario) {

    var empty = true;
    var errors = {};

    for (var key in proyectousuario) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "usuario":
                errors[key].empty = validation.empty(proyectousuario[key]);

                //Validar si existe el proyectousuario
                if (await usuarios.findByPk(proyectousuario[key]) == null)
                    errors[key].none = "El usuario asociado no existe";
                break;

            case "proyectocodigo":
            case "proyectoadministrador":
                errors[key].empty = validation.empty(proyectousuario[key]);

                //Validar si existe el proyecto
                if (validation.number(proyectousuario["proyectocodigo"]) == undefined) {
                    if (await proyectos.findOne({ where: { codigo: proyectousuario["proyectocodigo"], administrador: proyectousuario["proyectoadministrador"] } }) == null)
                        errors[key].none = "El proyecto asociado no existe";
                } else {
                    errors["proyectocodigo"].format = "Tipo no válido.";
                }
                break;
            default:
                delete proyectousuario[key];
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