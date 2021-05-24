const db = require("../models");
const usuario = require("../models/usuario");
const Usuarios = db.usuarios;
const usuariogrupos = db.usuariogrupos;
const Grupos = db.grupos;
const validation = require("../validation/validation")


//Crear usuariogrupo
exports.create = async(req, res) => {

    const usuariogrupo = req.body;

    if (req.params.id != null && req.params.empresa != null) {
        usuariogrupo.codigogrupo = parseInt(req.params.id);
        usuariogrupo.empresagrupo = req.params.empresa;
    }

    //Validar
    const errors = await validateUsuariogrupo(usuariogrupo);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }



    usuariogrupos.create(usuariogrupo).then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando la fila."
            });
        });

}

// Mostrar todas els usuariogrupos
exports.findAll = (req, res) => {
    usuariogrupos.findAll().then(data => { res.status(200).json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    const usuario = req.params.usuario;
    const codigo = req.params.codigo;
    const empresa = req.params.empresa;
    usuariogrupos.findOne({ where: { usuario: usuario, codigogrupo: codigo, empresagrupo: empresa } }).then(data => { res.status(200).json(data) });
};

// Mostrar según usuario
exports.usuario = (req, res) => {
    const usuario = req.params.usuario;
    usuariogrupos.findAll({ where: { usuario: usuario } }).then(data => { res.status(200).json(data) });
};

// Mostrar según grupo
exports.grupo = (req, res) => {
    const codigo = req.params.codigo;
    const empresa = req.params.empresa;
    usuariogrupos.findAll({ where: { codigo: codigo, empresa: empresa } }).then(data => { res.status(200).json(data) });
};

// Modificar
exports.update = async(req, res) => {

    const usuariogrupo = req.body;

    const usuario = req.params.usuario;
    const codigo = req.params.codigo;
    const empresa = req.params.empresa;

    //Validar
    const errors = await validateUsuariogrupo(usuariogrupo);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    usuariogrupos.update(req.body, {
            where: { usuario: usuario, codigogrupo: codigo, empresagrupo: empresa }
        }).then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "La fila ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar la fila con usuario ${usuario} y grupo ${codigo} de la empresa ${empresa}. Compruebe el dirección o el cuerpo de el request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error modificando la fila con usuario ${usuario} y grupo ${codigo} de la empresa ${empresa}.`
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const usuario = req.params.usuario;
    const codigo = req.params.codigo;
    const empresa = req.params.empresa;

    usuariogrupos.destroy({ where: { usuario: usuario, codigogrupo: codigo, empresagrupo: empresa } }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La fila fue eliminada con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse la fila con usuario ${usuario} y grupo ${codigo} de la empresa ${empresa}. La información puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error al intentar eliminar la fila con usuario ${usuario} y grupo ${codigo} de la empresa ${empresa}.`
            });
        })
}

//VAlIDATE USUARIOGRUPO
async function validateUsuariogrupo(usuariogrupo) {

    var empty = true;
    var errors = {};

    for (var key in usuariogrupo) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "usuario":
                errors[key].empty = validation.empty(usuariogrupo[key]);

                //Validar si existe el usuario
                if (await Usuarios.findByPk(usuariogrupo[key]) == null)
                    errors[key].none = "El usuario asociado no existe";
                break;

            case "administrador":
                if (typeof usuariogrupo[key] != "boolean") {
                    errors[key].type = "Tipo de dato no válido."
                }

                break;

            case "codigogrupo":
            case "empresagrupo":
                errors[key].empty = validation.empty(usuariogrupo[key]);

                //Validar si existe el grupo
                if (validation.number(usuariogrupo["codigogrupo"]) == undefined) {
                    console.log("\n\n\n\n\n\n\n\n" + validation.number(1) + "\n\n\n\n\n\n\n\n");
                    if (await Grupos.findOne({ where: { codigo: usuariogrupo["codigogrupo"], empresa: usuariogrupo["empresagrupo"] } }) == null)
                        errors[key].none = "El grupo asociado no existe";
                } else {
                    errors["codigogrupo"].format = "Tipo no válido.";
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