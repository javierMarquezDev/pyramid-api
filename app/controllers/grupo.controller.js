const myLogger = require("../log/logger");
const db = require("../models");
const grupo = require("../models/grupo");
const usuariogrupos = db.usuariogrupos;
const grupos = db.grupos;
const validation = require("../validation/validation");
const Empresas = db.empresas;
const Usuarios = db.usuarios;
const { empresausuarios, usuarios, sequelize } = require('../models');
const {QueryTypes} = require("sequelize");

//Crear grupo
exports.create = async(req, res) => {

    const grupo = req.body;
    grupo["empresa"] = req.params.empresa;

    //Validar
    const errors = await validateGrupo(grupo);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    grupos.create(grupo).then(data => {
            res.status(201).send({
                message: "Grupo creado con éxito.",
                grupo: data
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando el grupo."
            });
        });

}

// Mostrar todas els grupos
exports.findAll = (req, res) => {
    grupos.findAll().then(data => { res.json(data) });
};

// Mostrar grupo según PK
exports.findOne = (req, res) => {
    if(isNaN(req.params.id)) res.status(404).send({message:"Parámetro no válido."});
    grupos.findOne({ where: { codigo: req.params.id, empresa: req.params.empresa } }).then(data => { res.json(data) });
};

// Mostrar grupos según empresa
exports.empresa = (req, res) => {
    grupos.findAll({ where: { empresa: req.params.empresa } }).then(data => { res.json(data) });
};

// Mostrar grupos según admin
exports.admin = (req, res) => {
    grupos.findAll({ where: { administrador: req.params.admin } }).then(data => { res.json(data) });
};

// Mostrar grupos segun finalizacion
exports.fin = (req, res) => {
    grupos.findAll({ where: { finalizado: req.params.fin } }).then(data => { res.json(data) });
};

//Mostrar grupos según usuario
exports.usuario = async (req,res) => {
    sequelize.query(
        `SELECT * from public.grupo WHERE codigo IN (SELECT codigogrupo FROM public.usuariogrupo WHERE usuario like '${req.params.user}') AND empresa IN (SELECT empresagrupo FROM public.usuariogrupo WHERE usuario like '${req.params.user}')`,
        {type: QueryTypes.SELECT})
    .then(data => res.status(200).json(data));
}

//Mostrar usuarios según grupo
exports.usuarios = async (req,res) => {
    if(isNaN(req.params.codigo)) res.status(404).send({message:"Parámetro no válido."});
    sequelize.query(
        `SELECT * from public.usuario WHERE usuario.email IN (SELECT usuario FROM public.usuariogrupo WHERE empresagrupo LIKE '${req.params.empresa}' AND codigogrupo = '${req.params.codigo}')`,
        {type: QueryTypes.SELECT})
    .then(data => res.status(200).json(data));
}

//Retrieve grupos by admin
exports.gruposadmin = (req,res) => {
    sequelize.query(
        `SELECT * from public.grupo WHERE grupo.empresa `+
         `IN (SELECT empresagrupo FROM public.usuariogrupo WHERE usuario like '${req.params.email}' AND administrador IS TRUE) `+
         `AND grupo.codigo IN (SELECT codigogrupo FROM public.usuariogrupo WHERE usuario like '${req.params.email}' AND administrador IS TRUE)`,
        {type: QueryTypes.SELECT})
    .then(data => res.status(200).json(data));
}

//Retrieve admins by grupo
exports.adminsgrupo = (req,res) => {
    if(isNaN(req.params.codigo)) res.status(404).send({message:"Parámetro no válido."});
    sequelize.query(
        `SELECT * from public.usuario WHERE usuario.email IN `+
        `(SELECT usuario FROM public.usuariogrupo WHERE (codigogrupo,empresagrupo) = ('${req.params.codigo}','${req.params.empresa}') AND administrador IS TRUE)`,
        {type: QueryTypes.SELECT})
    .then(data => res.status(200).json(data));
}

//Check if usuario is admin
exports.checkAdmin = (req,res) => {
    if(isNaN(req.params.grupocodigo)) res.status(404).send({message:"Parámetro no válido."});
    const grupoempresa = req.params.grupoempresa;
    const grupocodigo = req.params.grupocodigo;
    const usuario = req.params.email;

    sequelize.query(
        `SELECT administrador from public.usuariogrupo WHERE `+
        `codigogrupo = '${grupocodigo}' AND empresagrupo LIKE '${grupoempresa}' `+
        `AND usuario LIKE '${usuario}'`,
        {type: QueryTypes.SELECT})
    .then(data => res.status(200).json(data));
}

// Modificar
exports.update = async(req, res) => {
    if(isNaN(req.params.id)) res.status(404).send({message:"Parámetro no válido."});
    const id = req.params.id;
    const empresa = req.params.empresa;

    const grupo = req.body;
    grupo.empresa = req.params.empresa;

    myLogger.log(grupo)

    //Validar
    const errors = await validateGrupo(grupo);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    grupos.update(req.body, {
            where: {
                codigo: id,
                empresa: empresa
            }
        }).then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "El grupo ha sido modificado exitosamente."
                });
            } else {
                res.status(400).send({
                    message: `No es posible modificar el grupo con código ${id} de la empresa con CIF ${empresa}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error modificando el grupo con código ${id} de la empresa con CIF ${empresa}.`
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    if(isNaN(req.params.id)) res.status(404).send({message:"Parámetro no válido."});
    const id = req.params.id;
    const empresa = req.params.empresa;

    grupos.destroy({
            where: {
                codigo: id,
                empresa: empresa
            }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "El grupo fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse el grupo con código ${id} de la empresa con CIF ${empresa}. La información puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error al intentar eliminar el grupo con código ${id} de la empresa con CIF ${empresa} `+err
            });
        })
}

exports.addUsuarios = (req,res) => {
    usuariogrupos.bulkCreate(req.body)
    .then(data => {
        res.status(200).send({message:"Usuario(s) añadido(s) con éxito"})
    })
    .catch(err => res.status(500).send({message:"Error del servidor. "+err}))
}

exports.modifyUsuarios = (req,res) => {

    myLogger.log(req.body)

    if(isNaN(req.params.codigo)) res.status(404).send({message:"Parámetro no válido."});

    grupos.findOne({where:{
                        codigo:req.params.codigo,
                        empresa:req.params.empresa
                    }})
    .then(data => {
            usuariogrupos.destroy({where:{codigogrupo:req.params.codigo, empresagrupo:req.params.empresa}})
            .then(data => {

                myLogger.log(req.body)

                usuariogrupos.bulkCreate(req.body)
                .then(data => {
                    res.status(200).send({message:"Usuario(s) añadido(s) con éxito"})
                })
                .catch(err => {
                    myLogger.log(err)
                    res.status(500).send({message:"Error del servidor. ", error:err})})

            });
        
    })

}

//VAlIDATE GRUPO
async function validateGrupo(grupo) {

    var empty = true;
    var errors = {};

    for (var key in grupo) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "empresa":
                errors[key].empty = validation.empty(grupo[key]);

                //Validar si existe la empresa
                if (await Empresas.findByPk(grupo[key]) == null)
                    errors[key].none = "La empresa asociada no existe";
                break;//

            case "nombre":
                errors[key].empty = validation.empty(grupo[key]);
                errors[key].xtsn = validation.maxtsn(grupo[key], 30);
                break;
            case "descripcion":
                errors[key].empty = validation.empty( grupo[key]);
                errors[key].xtsn = validation.maxtsn(grupo[key], 200);
                break;
            case "fechahora":

                //2021-09-04T00:00:00.000+02:00

                if (isNaN(Date.parse(grupo[key]))) {
                    errors[key].format = "No es una fecha válida."
                } else {
                    grupo[key] = new Date(Date.parse(grupo[key])).toISOString();
                }

                break;
            case "finalizado":
                if (!(Boolean(grupo[key]) === true || Boolean(grupo[key]) === false)) {
                    errors[key].format = "Tipo de dato no válido."

                }else{
                    grupo[key] = Boolean(grupo[key])
                }

                break;
            default:
                delete grupo[key];
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