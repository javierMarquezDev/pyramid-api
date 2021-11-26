// LOGOUT

exports.logout = (req,res) =>{
    res.status(200).json({message:"Sesión cerrada."});
}