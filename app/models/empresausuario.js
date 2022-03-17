const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('empresausuario', {
        usuario: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'usuario',
                key: 'email'
            }
        },
        empresa: {
            type: Sequelize.STRING(9),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'empresa',
                key: 'nif'
            }
        },
        admin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        sequelize,
        tableName: 'empresausuario',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "empresausuario_pkey",
            unique: true,
            fields: [
                { name: "usuario" },
                { name: "empresa" }
            ]
        }, ]
    });
};