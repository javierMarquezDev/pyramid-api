const   express = require("express"),
        server = require("../../server");

const authRequired = express.Router();
const db = require('../models');
const empresausuarios = db.empresausuarios;

exports.auth = authRequired.use((req, res, next) => {

    //next()

    const token = req.headers['access-token'];
 
    if (token) {
        server.verifyJWT(token,(err, usuario) => {      
            if (err) {
              return res.status(403).json({ message: 'Acceso denegado.' });    
            } else {
              //req.usuario = usuario;    
              next();
            }
          });
    } else {
      res.status(403).send({ 
          mensaje: 'Credenciales insuficientes.'
      });
    }
 });

 exports.empresauser = authRequired.use(async (req,res,next)=>{

  next();
  /*
  const usuario = req.usuario;
  const empresa = req.params.empresa;

  const membresia = await empresausuarios.findOne({where:{usuario:usuario, empresa:empresa}});

  if(membresia === null)
    res.status(400).send({
      mensaje: 'Acceso denegado'
    })
*/

});

