const db = require("../models");
const usuario = require("../models/usuario");
const Usuarios = db.usuarios;
const Empresas = db.empresas;
const Grupos = db.grupos;
const validation = require("../validation/validation")


//Crear empresausuario
exports.create = async(req, res) => {

    const empresausuario = req.body;

    //Validar
    const errors = await validateEmpresaUsuario(empresausuario);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    empresausuarios.create(empresausuario).then(data => {
            res.status(201).send({
                message: "Usuario añadido con éxito."
            });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error asignando el usuario."
            });
        });

}

// Mostrar según PK
exports.findOne = (req, res) => {
    const usuario = req.params.usuario;
    const empresa = req.params.empresa;
    empresausuarios.findOne({ where: { usuario: usuario, empresa: empresa } }).then(data => { res.status(200).json(data) });
};

// Mostrar según usuario
exports.usuario = (req, res) => {
    const usuario = req.params.usuario;
    empresausuarios.findAll({ where: { usuario: usuario } }).then(data => { res.status(200).json(data) });
};

// Mostrar según empresa
exports.empresa = (req, res) => {
    const empresa = req.params.empresa;
    empresausuarios.findAll({ where: { empresa: empresa } }).then(data => { res.status(200).json(data) });
};


// Modificar
exports.update = async(req, res) => {

    const empresausuario = req.body;

    //Validar
    const errors = await validateEmpresaUsuario(empresausuario);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    empresausuarios.update(req.body, {
            where: { usuario: usuario, empresa: empresa }
        }).then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "La información ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar la información con usuario ${usuario} y grupo ${codigo} de la empresa ${empresa}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error modificando la información del usuario ${usuario} y la empresa ${empresa}.`
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const usuario = req.params.usuario;
    const empresa = req.params.empresa;

    empresausuarios.destroy({ where: { usuario: usuario, empresa: empresa } }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La información fue eliminada con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse la información del usuario ${usuario} y la empresa ${empresa}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error al intentar eliminar.`
            });
        })
}

//VAlIDATE USUARIOGRUPO
async function validateEmpresaUsuario(empresausuario) {

    var empty = true;
    var errors = {};

    for (var key in empresausuario) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "usuario":
                errors[key].empty = validation.empty(empresausuario[key]);

                //Validar si existe el usuario
                if (await Usuarios.findByPk(empresausuario[key]) == null)
                    errors[key].none = "El usuario asociado no existe";
                break;

            case "empresa":
                errors[key].empty = validation.empty(empresausuario[key]);

                //Validar si existe la empresa
                if (await Empresas.findOne({ where: { nif: empresausuario["empresa"] } }) == null)
                    errors[key].none = "La empresa no existe";
                break;
            default:
                delete empresausuario[key];
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