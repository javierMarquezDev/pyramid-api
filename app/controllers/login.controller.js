const myLogger = require("../log/logger");
const         server = require("../../server");

const   db = require("../models"),
        Usuarios = db.usuarios;


// Login
exports.login = async(req,res) => {

    const provided = req.body;

    const errors = null;

    if (errors != null) {
        res.status(400).send(errors);
        return;
    }

    await Usuarios.findByPk(provided.email).then(data =>{
        if(data == null){
            res.status(400).json({error:{email:{valid:"El usuario no existe"}}});
            return;
        }else{        
            if(!Usuarios.decrypt(provided.contrasena,data.contrasena)){
                res.status(400).json({error:{contrasena:{valid:"La contraseña es incorrecta"}}});
                return;
            }else{
                const server = require("../../server");
                const token = server.resJWT();
                const usuario = data;
                data.contrasena = undefined;
                res.status(200).json({
                    message:"Autenticación correcta",
                    token:token,
                    usuario: usuario
                });
                return;
            }
        }
    })

}

exports.checkToken = (req,res) => {

    const token = req.body.token;

    if (token) {
        server.verifyJWT(token,(err, usuario) => {      
            if (err) {
              return res.status(200).json({ unvalid: 'Token expirado.' });    
            } else {
                return res.status(200).json({ valid: 'Token válido.' });    
            }
          });
    }

}

exports.checkPass = async (req,res) => {
    const email = req.body.email;
    const pass = req.body.pass;

    myLogger.log(req.body)

    const result = await Usuarios.findByPk(email)
    .then(data => {
        
        if(data == null)
            return {valid:false, error:{contrasena:{valid:"El usuario no existe"}}}

        if(!Usuarios.decrypt(pass,data.contrasena)){
            return {valid:false, error:{contrasena:{valid:"La contraseña es incorrecta"}}};
        }
            

        return {valid:true};
    })

    myLogger.log(result)

    return res.json(result);
        
}