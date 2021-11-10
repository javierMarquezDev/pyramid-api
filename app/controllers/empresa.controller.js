const db = require("../models");
const validation = require("../validation/validation");
const Empresas = db.empresas;
const Usuarios = db.usuarios;

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
            res.status(201).send(data);
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
    Empresas.findAll({ where: { nombre: req.params.nombre } }).then(data => { res.status(200).json(data) });
};

// Mostrar según PK
exports.findOne = (req, res) => {
    Empresas.findByPk(req.params.id).then(data => { res.status(200).json(data) });
};

// Modificar
exports.update = async (req, res) => {

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
                    message: "La empresa ha sido modificado exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar la empresa con CIF ${id}. Compruebe la dirección o el cuerpo de la request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando la empresa con CIF " + id + "."
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
                    message: "La empresa fue eliminado con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse la empresa con CIF ${id}. La dirección puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar la empresa con dirección " + id + "."
            });
        })
}

//VAlIDATE EMPRESA
async function validateEmpresa(empresa) {

    var empty = true;
    var errors = {};

    for (var key in empresa) {
        (errors[key] == null) ? errors[key] = {}: false;
        switch (key) {
            case "nif":
                errors[key].empty = validation.empty(empresa[key]);
                errors[key].xtsn = validation.maxtsn(empresa[key], 9);
                errors[key].format = validation.cif(empresa[key]);

                //Comprobar que el CIF no está pillado
                if (await Empresas.findByPk(empresa[key]) != null)
                    errors[key].exists = "El CIF ya existe.";

                break;
            case "razonsocial":
                errors[key].empty = validation.empty(empresa[key]);
                errors[key].xtsn = validation.maxtsn(empresa[key], 50);
                errors[key].format = validation.razonsocial(empresa[key]);
                break;
            case "nombre":
                errors[key].valid = validation.humanname(empresa[key]);
                errors[key].xtsn = validation.maxtsn(empresa[key], 50);
                break;
            case "administrador":
                errors[key].format = validation.email(empresa[key]);

                //Validar si existe el usuario
                if (await Usuarios.findByPk(empresa[key]) == null)

                    errors[key].none = "El usuario no existe.";

                break;
            case "tipovia":
                errors.tipovia.empty = validation.empty(empresa[key]);
                errors.tipovia.valid = validation.tipovia(empresa[key]);
                break;
            case "nombrevia":
                errors[key].empty = validation.empty(empresa[key]);
                errors[key].valid = validation.humanname(empresa[key]);
                break;
            case "numvia":
                errors[key].empty = validation.empty(empresa[key]);
                errors[key].valid = validation.regex(empresa[key], /^\w*$/);
                break;
            case "codigopuerta":
                errors[key].max = validation.maxtsn(empresa[key], 5);
                errors[key].min = validation.mnxtsn(empresa[key], 1);
                errors[key].valid = validation.regex(empresa[key], /^\w*?(º|ª)?\w*?$/);
                break;
            default:
                delete empresa[key];
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