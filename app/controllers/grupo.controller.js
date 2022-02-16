const db = require("../models");
const grupo = require("../models/grupo");
const usuariogrupos = db.usuariogrupos;
const grupos = db.grupos;
const validation = require("../validation/validation");
const Empresas = db.empresas;
const Usuarios = db.usuarios;

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
            res.status(201).send(data);
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
    const user = req.params.user;
    usuariogrupos.findAll({where:{usuario: user}}).then( async data =>{

        var grupoSet = [];
        const dataArray = Array.from(data);

        for(var i = 0; i<data.length; i++){
        
            value = await grupos.findAll({where:{codigo: parseInt(dataArray[i].dataValues.codigogrupo) ,empresa: dataArray[i].dataValues.empresagrupo }}).then(
                data => {
                    return data[0].dataValues;
                }
            )

            grupoSet.push(await value);
        };

        res.status(200).json(grupoSet);
    })
}

//Mostrar grupos según empresa y usuario

// Modificar
exports.update = async(req, res) => {
    const id = req.params.id;
    const empresa = req.params.empresa;

    const grupo = req.body;
    grupo.empresa = req.params.empresa;

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
                    message: `No es posible modificar el grupo con código ${id} de la empresa con CIF ${empresa}. Compruebe la dirección o el cuerpo de la request.`
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
                message: `Error al intentar eliminar el grupo con código ${id} de la empresa con CIF ${empresa}`
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
                break;

            case "nombre":
                errors[key].empty = validation.empty(grupo[key]);
                errors[key].xtsn = validation.maxtsn(grupo[key], 30);
                break;
            case "descripcion":
                errors[key].empty = validation.empty(grupo[key]);
                errors[key].xtsn = validation.maxtsn(grupo[key], 200);
                break;
            case "administrador":
                errors[key].empty = validation.empty(grupo[key]);

                //Validar si existe la empresa
                if (await Usuarios.findByPk(grupo[key]) == null)
                    errors[key].none = "El usuario administrador no existe";
                break;
            case "fechahora":

                //2021-09-04T00:00:00.000+02:00

                if (isNaN(Date.parse(proyecto[key]))) {
                    errors[key].format = "No es una fecha válida."
                } else {
                    proyecto[key] = new Date(Date.parse(proyecto[key])).toISOString();
                }

                break;
            case "finalizado":
                if (typeof proyecto[key] != "boolean") {
                    errors[key].type = "Tipo de dato no válido."
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