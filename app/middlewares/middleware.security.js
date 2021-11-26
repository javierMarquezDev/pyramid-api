const   express = require("express"),
        server = require("../../server");

const authRequired = express.Router();

exports.auth = authRequired.use((req, res, next) => {
    const token = req.headers['access-token'];
 
    if (token) {
        server.verifyJWT(token,(err, decoded) => {      
            if (err) {
              return res.status(403).json({ message: 'Acceso denegado.' });    
            } else {
              req.decoded = decoded;    
              next();
            }
          });
    } else {
      res.status(403).send({ 
          mensaje: 'Credenciales insuficientes.' 
      });
    }
 });

