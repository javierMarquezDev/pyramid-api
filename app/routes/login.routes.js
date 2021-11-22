const login = require("../controllers/login.controller");

module.exports = app => {
    
    var router = require("express").Router();

    router.post("/login",login.login);

    app.use('/', router);
}