const db = require("../models");
const grupo = require("../models/grupo");
const grupos = db.grupos;
const validation = require("../validation/validation");
const Empresas = db.empresas;

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
            case "codigosub":
            case "empresasub":

                //Validar si existe subgrupo
                if (await grupos.findOne({
                        where: {
                            codigo: grupo["codigosub"],
                            empresasub: grupo["empresasub"]
                        }
                    }) == null)
                    errors[key].none = "El subgrupo no existe o el código es incorrecto.";

                break;
            default:
                delete grupo[key];
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