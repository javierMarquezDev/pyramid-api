const db = require("../models");
const rol = require("../models/rol");
const rols = db.roles;

const validation = require("../validation/validation")
const Op = db.Sequelize.Op;

//Crear rol
exports.create = async(req, res) => {

    const rol = req.body;

    rol.grupoempresa = req.params.grupoempresa;
    rol.grupocodigo = req.params.grupocodigo;
    rol.autor = req.params.autor;

    //Validar
    const errors = await validateRol(rol);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    rols.create(rol).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el rol."
            });
        });

}

// Mostrar todas las rols
exports.findAll = (req, res) => {
    rols.findAll().then(data => { res.status(200).json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    rols.findByPk(req.params.id).then(data => { res.status(200).json(data) });
};

// Mostrar según nombre
exports.nombre = (req, res) => {
    rols.findOne({
        where: {
            nombre: req.params.nombre
        }
    }).then(data => { res.status(200).json(data) });
};


// Modificar
exports.update = async(req, res) => {
    const id = req.params.id;

    //Validar
    const errors = await validateRol(rol);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    rols.update(req.body, {
            where: { codigo: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El rol ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar el rol. Compruebe la dirección o el cuerpo de la request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando el rol con CIF."
            });
        });
};

// ELiminar
exports.deleteOne = (req, res) => {
    const codigo = req.params.id;

    rols.destroy({ where: { codigo: codigo } }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El rol fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el rol. La información puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar el rol."
            });
        })
}

//VAlIDATE NOTICIA
async function validateRol(rol) {

    var empty = true;
    var errors = {};

    for (var key in rol) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "codigo":
                //errors[key].empty = validation.empty(rol[key]);
                if (validation.number(rol[key]) == undefined) {
                    errors[key].valid = "Tipo no válido.";
                }
            case "nombre":
                errors[key].empty = validation.empty(rol[key]);
                errors[key].xtsn = validation.maxtsn(rol[key], 30);
                break;

            case "descripcion":
                errors[key].empty = validation.empty(rol[key]);
                errors[key].xtsn = validation.maxtsn(rol[key], 200);
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