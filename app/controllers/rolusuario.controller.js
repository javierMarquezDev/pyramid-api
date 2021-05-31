const db = require("../models");
const Usuarios = db.usuarios;
const Rols = db.roles;
const rolusuarios = db.rolusuarios;
const validation = require("../validation/validation")


//Crear rolusuario
exports.create = async(req, res) => {

    const rolusuario = req.body;

    if (req.params.rol != null && req.params.usuario != null) {
        rolusuario.rol = parseInt(req.params.rol);
        rolusuario.usuario = req.params.usuario;
    }

    //Validar
    const errors = await validateRolusuario(rolusuario);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }



    rolusuarios.create(rolusuario).then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando la fila."
            });
        });

}

// Mostrar todas els rolusuarios
exports.findAll = (req, res) => {
    rolusuarios.findAll().then(data => { res.status(200).json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    const usuario = req.params.usuario;
    const rol = req.params.rol;
    rolusuarios.findOne({ where: { rol: rol, usuario: usuario } }).then(data => { res.status(200).json(data) });
};

// Mostrar según usuario
exports.usuario = (req, res) => {
    const usuario = req.params.usuario;
    rolusuarios.findAll({ where: { usuario: usuario } }).then(data => { res.status(200).json(data) });
};

// Mostrar según rol
exports.rol = (req, res) => {
    const rol = req.params.rol;
    rolusuarios.findAll({ where: { rol: rol } }).then(data => { res.status(200).json(data) });
};

// Modificar
exports.update = async(req, res) => {

    const rolusuario = req.body;

    const usuario = req.params.usuario;
    const rol = req.params.rol;

    //Validar
    const errors = await validateRolusuario(rolusuario);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    rolusuarios.update(req.body, {
            where: { usuario: usuario, rol: rol, usuario: usuario }
        }).then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "La fila ha sido modificada exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar la fila.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error modificando la fila.`
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const rol = req.params.rol;
    const usuario = req.params.usuario;

    rolusuarios.destroy({ where: { usuario: usuario, rol: rol, usuario: usuario } }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La fila fue eliminada con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse la fila.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error al intentar eliminar la fila.`
            });
        })
}

//VAlIDATE USUARIOGRUPO
async function validateRolusuario(rolusuario) {

    var empty = true;
    var errors = {};

    for (var key in rolusuario) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "usuario":
                errors[key].empty = validation.empty(rolusuario[key]);

                //Validar si existe el usuario
                if (await Usuarios.findByPk(rolusuario[key]) == null)
                    errors[key].none = "El usuario asociado no existe";
                break;
            case "rol":
                errors[key].empty = validation.empty(rolusuario[key]);

                //Validar si existe el rol
                if (await Rols.findByPk(rolusuario[key]) == null)
                    errors[key].none = "El rol asociado no existe";
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