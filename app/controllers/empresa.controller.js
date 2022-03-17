const db = require("../models");
const validation = require("../validation/validation");
const { empresausuarios, usuarios, sequelize, empresas } = require('../models');
const Empresas = db.empresas;
const Usuarios = db.usuarios;
const {Op} = require('sequelize');
const {QueryTypes} = require("sequelize");
const myLogger = require("../log/logger");


//Crear empresa
exports.create = async(req, res) => {

    //Validar
    const errors = await validateEmpresa(req.body);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    const empresa = req.body;

    Empresas.create(empresa).then(data => {
            res.status(201).send({
                message: "Empresa creada con éxito.",
                empresa:data
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error creando la empresa."
            });
        });

}

// Mostrar todas las empresas
exports.findAll = (req, res) => {
    Empresas.findAll().then(data => { res.status(200).json(data) });
};

// Mostrar por nombre
exports.name = (req, res) => {
    Empresas.findAll({ where: {
         nombre: {
             [Op.or]:[
                 {[Op.iLike]:req.params.nombre},
                 {[Op.iLike]:'%'+req.params.nombre+'%'},
                 {[Op.iLike]:req.params.nombre+'%'},
                 {[Op.iLike]:'%'+req.params.nombre}

             ]
         }
        } 
        }).then(data => { res.status(200).json(data) });
};

// Mostrar por admin
exports.admin = (req, res) => {
    Empresas.findAll({ where: { administrador: req.params.admin } }).then(data => { res.status(200).json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    Empresas.findByPk(req.params.id).then(data => { res.status(200).json(data) });
};

// Modificar
exports.update = async (req, res) => {

    myLogger.log(req.body)

    //Validar
    const errors = await validateEmpresa(req.body);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    const id = req.params.id;

    Empresas.update(req.body, {
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La empresa ha sido modificada exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar la empresa con CIF ${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando la empresa con CIF " + id + ".",
                error:err
            });
        });
};

// Eliminar
exports.deleteOne = (req, res) => {
    const id = req.params.id;

    Empresas.destroy({
            where: { nif: id }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La empresa fue eliminada con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse la empresa con CIF ${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar la empresa con dirección " + id + " "+err
            });
        })
}

//Retrieve empresas by usuario
exports.empresasusuario = (req,res) => {
    sequelize.query(
        `SELECT * from public.empresa WHERE empresa.nif IN (SELECT empresa FROM public.empresausuario WHERE usuario like '${req.params.email}')`,
        {type: QueryTypes.SELECT})
    .then(data => res.status(200).json(data));
}

//Check if usuario is admin
exports.checkAdmin = (req,res) => {
    const empresa = req.params.cif;
    const usuario = req.params.email;

    sequelize.query(
        `SELECT admin from public.empresausuario WHERE empresa LIKE '${empresa}' AND usuario LIKE '${usuario}'`,
        {type: QueryTypes.SELECT})
    .then(data => res.status(200).json(data));
}

//Check if usuario es miembro
exports.checkmember = (req,res) => {
    const empresa = req.params.cif;
    const usuario = req.params.email;

    myLogger.log(empresa)
    myLogger.log(usuario)

    sequelize.query(
        `SELECT * from public.empresausuario WHERE empresausuario.empresa LIKE '${empresa}' AND empresausuario.usuario LIKE '${usuario}'`,
        {type: QueryTypes.SELECT})
    .then(data => {
        myLogger.log(empresa,usuario)
        res.status(200).json(data)});
}

//Retrieve usuarios by empresa
exports.usuariosempresa = (req, res) => {
    sequelize.query(
        `SELECT * from public.usuario WHERE usuario.email IN (SELECT usuario FROM public.empresausuario WHERE empresa like '${req.params.cif}')`,
        {type: QueryTypes.SELECT})
    .then(data => res.status(200).json(data));
    
};

//Retrieve empresas by admin
exports.empresasadmin = (req,res) => {
    sequelize.query(
        `SELECT * from public.empresa WHERE empresa.nif IN (SELECT empresa FROM public.empresausuario WHERE usuario like '${req.params.email}' AND admin IS TRUE)`,
        {type: QueryTypes.SELECT})
    .then(data => res.status(200).json(data));
}

//Retrieve admins by empresa
exports.adminsempresa = (req,res) => {
    sequelize.query(
        `SELECT * from public.usuario WHERE usuario.email IN (SELECT usuario FROM public.empresausuario WHERE empresa like '${req.params.cif}' AND admin IS TRUE)`,
        {type: QueryTypes.SELECT})
    .then(data => res.status(200).json(data));
}

//Añadir usuarios
exports.addUsuarios = (req,res) => {

    empresausuarios.bulkCreate(req.body)
    .then(num => {
        res.status(200).send({message:"Usuario(s) añadido(s) con éxito"})
    })
    .catch(err => res.status(500).send({message:"Error del servidor. "+err}))
}


//Modificar lista de usuarios
exports.modifyUsuarios = (req,res) => {

    Empresas.findByPk(req.params.empresa)
    .then(data => {
        
            empresausuarios.destroy({where:{empresa:req.params.empresa}})
            .then(data => {

                myLogger.log(req.body)

                empresausuarios.bulkCreate(req.body)
                .then(data => {
                    res.status(200).send({message:"Usuario(s) añadido(s) con éxito"})
                })
                .catch(err => {
                    myLogger.log(err)
                    res.status(500).send({message:"Error del servidor. "+err})})

            });
        
    })

}

//VAlIDATE EMPRESA
async function validateEmpresa(empresa) {

    var empty = true;////
    var errors = {};

    for (var key in empresa) {
        (errors[key] == null) ? errors[key] = {}: false;
        switch (key) {
            case "nif":
                errors[key].empty = validation.empty(empresa[key]);
                errors[key].xtsn = validation.maxtsn(empresa[key], 9);
                errors[key].format = (validation.cif(empresa[key]))?undefined:"El CIF no es válido.";

                //Comprobar que el CIF no está pillado
                if (await Empresas.findByPk(empresa[key]) != null)
                    errors[key].exists = "El CIF ya está registrado.";
//
                break;
            case "razonsocial":
                errors[key].empty = validation.empty(empresa[key]);
                errors[key].xtsn = validation.maxtsn(empresa[key], 50);
                errors[key].format = validation.razonsocial(empresa[key] || '');
                break;
            case "nombre":
                errors[key].empty = validation.empty(empresa[key]);
                errors[key].valid = validation.humanname(empresa[key]);
                errors[key].xtsn = validation.maxtsn(empresa[key], 50);
                break;
            // case "tipovia":
            //     errors.tipovia.empty = validation.empty(empresa[key]);
            //     errors.tipovia.valid = validation.tipovia(empresa[key]);
            //     break;
            case "nombrevia":
                errors[key].empty = validation.empty(empresa[key]);
                errors[key].valid = validation.humanname(empresa[key]);
                break;
            case "numvia":
                errors[key].empty = validation.empty(empresa[key]);
                //errors[key].valid = validation.regex(empresa[key], /^\w*$/);
                break;
            case "codigopuerta":
                errors[key].max = validation.maxtsn(empresa[key], 5);
                //errors[key].valid = validation.regex(empresa[key], /^\w*?(º|ª)?\w*?$/);
                break;
            case "localidad":
            case "provincia":
                errors[key].max = validation.maxtsn(empresa[key], 50);
                errors[key].min = validation.mnxtsn(empresa[key], 3);
                errors[key].valid = validation.humanname(empresa[key]);
                break;

            default:
                delete empresa[key];
                break;
        }
    }



    if(empresa['nombrevia'],empresa['numvia'],empresa['localidad'],empresa['provincia'] !== undefined)
    {
        errors = await validation.address({
            codigopuerta:empresa["codigopuerta"] || null,
            numvia: empresa['numvia'],
            nombrevia:empresa['nombrevia'],
            localidad:empresa['localidad'],
            provincia:empresa['provincia']
        },errors)
        .then(result => {
            return result.errors;
        });
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