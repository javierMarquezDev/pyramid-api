const myLogger = require("../log/logger");
const db = require("../models");
const noticia = require("../models/noticia");
const Noticias = db.noticias;
const Usuarios = db.usuarios;
const grupos = db.grupos;
const validation = require("../validation/validation")
const Op = db.Sequelize.Op;

//Crear noticia
exports.create = async(req, res) => {

    //Validar
    const errors = await validateNoticia(req.body);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    const noticia = req.body;

    noticia.grupoempresa = req.params.grupoempresa;
    noticia.grupocodigo = req.params.grupocodigo;
    noticia.autor = req.params.autor;

    Noticias.create(noticia).then(data => {
            res.status(201).send({
                message: "Noticia creada con éxito."
            });

        })
        .catch(err => {
            res.status(500).send({
                message: err.message + " Error creando la noticia."
            });
        });

}

/*// Mostrar todas las noticias
exports.findAll = (req, res) => {
    Noticias.findAll().then(data => { res.status(200).json(data) });
};*/

// Mostrar según PK
exports.findOne = async (req, res) => {
    if(isNaN(req.params.grupocodigo) || isNaN(req.params.codigo)) res.status(404).send({message:"Parámetro no válido."});
    const grupoempresa = req.params.grupoempresa;
    const grupocodigo = req.params.grupocodigo;
    const autor = req.params.autor;
    const codigo = req.params.codigo;

    await Noticias.findOne({ where: { codigo: codigo, grupoempresa: grupoempresa, grupocodigo: grupocodigo, autor: autor } }).then(data => { res.status(200).json(data) });
};

// Mostrar según grupo
exports.grupo = async (req, res) => {
    if(isNaN(req.params.grupocodigo)) res.status(404).send({message:"Parámetro no válido."});
    try {
    const grupoempresa = req.params.grupoempresa;
    const grupocodigo = req.params.grupocodigo;
    await Noticias.findAll({ where: { grupoempresa: grupoempresa, grupocodigo: grupocodigo } }).then(data => { res.status(200).json(data) });
} catch (UnhandledPromiseRejectionWarning) {
    res.status(400).json({ error: "No hay datos." });
}
};

// Mostrar según autor
exports.usuario = async (req, res) => {
    if(isNaN(req.params.grupocodigo)) res.status(404).send({message:"Parámetro no válido."});
    const grupoempresa = req.params.grupoempresa;
    const grupocodigo = req.params.grupocodigo;
    const autor = req.params.autor;
    await Noticias.findAll({ where: { grupoempresa: grupoempresa, grupocodigo: grupocodigo, autor: autor } }).then(data => { res.status(200).json(data) });
};

//
// Modificar
exports.update = async(req, res) => {
    if(isNaN(req.params.grupocodigo) || isNaN(req.params.codigo)) res.status(404).send({message:"Parámetro no válido."});
    const grupoempresa = req.params.grupoempresa;
    const grupocodigo = req.params.grupocodigo;
    const autor = req.params.autor;
    const codigo = req.params.codigo;

    let noticia = req.body
    noticia.grupoempresa = grupoempresa;
    noticia.grupocodigo = grupocodigo;
    noticia.autor = autor;
    noticia.codigo = codigo;

    //Validar
    const errors = await validateNoticia(noticia);

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    await Noticias.update(noticia, {
            where: { codigo: codigo, grupoempresa: grupoempresa, grupocodigo: grupocodigo, autor: autor }
        }).then(num => {
            if (num == 1) {
                res.send({
                    message: "La noticia ha sido modificada exitosamente."
                });
            } else {
                res.send({
                    message: `No es posible modificar la noticia. Compruebe la dirección o el cuerpo de la request.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error modificando la noticia con CIF."
            });
        });
};

// ELiminar
exports.deleteOne = async (req, res) => {
    if(isNaN(req.params.grupocodigo) || isNaN(req.params.codigo)) res.status(404).send({message:"Parámetro no válido."});
    const grupoempresa = req.params.grupoempresa;
    const grupocodigo = req.params.grupocodigo;
    const autor = req.params.autor;
    const codigo = req.params.codigo;

    await Noticias.destroy({ where: { codigo: codigo, grupoempresa: grupoempresa, grupocodigo: grupocodigo, autor: autor } }).then(num => {
            if (num == 1) {
                res.send({
                    message: "la noticia fue eliminada con éxito."
                });
            } else {
                res.send({
                    message: `No pudo eliminarse la noticia. La información puede estar equivocada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al intentar eliminar la noticia."
            });
        })
}

//VAlIDATE NOTICIA
async function validateNoticia(noticia) {

    myLogger.log(noticia)

    var empty = true;
    var errors = {};

    for (var key in noticia) {
        (errors[key] == null) ? errors[key] = {}: false;

        switch (key) {
            case "grupocodigo":
            case "grupoempresa":

                errors[key].empty = validation.empty(noticia[key]);

                //Validar si existe el proyecto
                if (validation.number(noticia["grupocodigo"]) == undefined) {
                    if (await grupos.findOne({ where: { codigo: noticia["grupocodigo"], empresa: noticia["grupoempresa"] } }) == null)
                        errors[key].none = "El grupo asociado no existe";
                } else {
                    errors["noticiacodigo"].format = "Tipo no válido.";
                }
                break; 

            case "autor":
                errors[key].empty = validation.empty(noticia[key]);

                //Validar si existe el autor
                if (await Usuarios.findByPk(noticia[key]) == null)
                    errors[key].none = "El autor no existe";
                break;
            case "fechahora":
                //2021-09-04T00:00:00.000+02:00
                myLogger.log(noticia[key]);    

                if (isNaN(Date.parse(noticia[key]))) {
                    errors[key].format = "No es una fecha válida."
                } else {
                    noticia[key] = new Date(Date.parse(noticia[key])).toISOString(); 
                    
                }
  
                break;
            case "texto":
                errors[key].empty = validation.empty(noticia[key]);
                errors[key].xtsn = validation.maxtsn(noticia[key], 400);
                break;
            case "imagen1":
            case "imagen2":
            case "imagen3":
            case "imagen4":
                errors[key].xtsn = validation.maxtsn(noticia[key], 32000);
                break;

            default:
                delete noticia[key];
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