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
            res.status(400).json({message:"El usuario no existe"});
            return;
        }else{        
            if(!Usuarios.decrypt(provided.contrasena,data.contrasena)){
                res.status(400).json({message:"La contraseña es incorrecta"});
                return;
            }else{
                const server = require("../../server");
                const token = server.resJWT();
                res.status(200).json({
                    message:"Autenticación correcta",
                    token:token,
                    usuario: data.email
                });
                return;
            }
        }
    })

}