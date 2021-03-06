const myLogger = require("../log/logger");
const db = require("../models");
const usuario = require("../models/usuario");
const Usuarios = db.usuarios;
const usuariogrupos = db.usuariogrupos;
const Grupos = db.grupos;
const validation = require("../validation/validation")


//Crear usuariogrupo
exports.create = async(req, res) => {

    if(isNaN(req.params.id)) res.status(404).send({message:"Parámetro no válido."});

    const usuariogrupo = req.body;
    usuariogrupo.codigogrupo = req.params.id;
    usuariogrupo.empresagrupo = req.params.empresa;
    

    myLogger.log(usuariogrupo)

    //Validar
    const errors = await validateUsuariogrupo(usuariogrupo);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }



    usuariogrupos.create(usuariogrupo).then(data => {
            res.status(201).send({
                message: "Usuario añadido con éxito."
            });
        })
        .catch(err => {
            myLogger.log(err)
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
    if(isNaN(req.params.codigo)) res.status(404).send({message:"Parámetro no válido."});

    myLogger.log(req.params)
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
    if(isNaN(req.params.codigo)) res.status(404).send({message:"Parámetro no válido."});

    const codigo = req.params.codigo;
    const empresa = req.params.empresa;
    usuariogrupos.findAll({ where: { codigogrupo: codigo, empresagrupo: empresa } }).then(data => { res.status(200).json(data) });
};

// Modificar
exports.update = async(req, res) => {

    if(isNaN(req.params.codigo)) res.status(404).send({message:"Parámetro no válido."});

    const usuariogrupo = req.body;

    const usuario = req.params.usuario;
    const codigo = req.params.codigo;
    const empresa = req.params.empresa;

    usuariogrupo.usuario = usuario;
    usuariogrupo.codigo = codigo;
    usuariogrupo.empresa = empresa;

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
                errors[key].empty = validation.empty(usuariogrupo[key]);
                if (!(Boolean(usuariogrupo[key]) === true || Boolean(usuariogrupo[key]) === false))
                    errors[key].format = "No es un tipo válido."

                break;

            case "codigogrupo":
            case "empresagrupo":
                errors[key].empty = validation.empty(usuariogrupo[key]);

                //Validar si existe el grupo
                if (validation.number(usuariogrupo["codigogrupo"]) == undefined) {
                    if (await Grupos.findOne({ where: { codigo: usuariogrupo["codigogrupo"], empresa: usuariogrupo["empresagrupo"] } }) == null)
                        errors[key].none = "El grupo asociado no existe";
                } else {
                    errors["codigogrupo"].format = "Tipo no válido.";
                }
                break;
            default:
                delete usuariogrupo[key];
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