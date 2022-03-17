const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.usuarios = require("./usuario.js")(sequelize, Sequelize);
db.empresas = require("./empresa.js")(sequelize, Sequelize);
db.empresausuarios = require("./empresausuario.js")(sequelize, Sequelize);
db.grupos = require("./grupo.js")(sequelize, Sequelize);
db.noticias = require("./noticia.js")(sequelize, Sequelize);
db.tareas = require("./tarea.js")(sequelize, Sequelize);
db.usuariogrupos = require("./usuariogrupo.js")(sequelize, Sequelize);
db.usuariotareas = require("./usuariotarea.js")(sequelize, Sequelize);

module.exports = db;