const logout = require("../controllers/logout.controller");

const auth = require("../middlewares/middleware.security");

module.exports = app => {
    
    var router = require("express").Router();

    router.post("/logout", (req,res,next)=>{auth.auth(req,res,next)}, (req,res) =>{logout.logout(req,res)} );

    app.use('/', router);
}