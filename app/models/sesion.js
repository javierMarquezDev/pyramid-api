const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('sesion', {
        codigo: {
            autoIncrement: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        usuario: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'usuario',
                key: 'email'
            }
        },
        horainicio: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.Sequelize.fn('now'),
            primaryKey: false
        },
        horafin: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'sesion',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "sesionpk",
            unique: true,
            fields: [
                { name: "usuario" },
                { name: "horainicio" },
            ]
        }, ]
    });
};