const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('rolusuario', {
        usuario: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'usuario',
                key: 'email'
            }
        },
        rol: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'rol',
                key: 'codigo'
            }
        }
    }, {
        sequelize,
        tableName: 'rolusuario',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "rolpk",
            unique: true,
            fields: [
                { name: "usuario" },
                { name: "rol" },
            ]
        }, ]
    });
};