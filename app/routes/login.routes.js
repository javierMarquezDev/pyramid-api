const login = require("../controllers/login.controller");

module.exports = app => {
    
    var router = require("express").Router();

    router.post("/login",login.login);

    router.post('/token',login.checkToken);

    router.post('/checkpass',login.checkPass);

    app.use('/api', router);
}