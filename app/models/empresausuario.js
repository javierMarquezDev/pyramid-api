const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('usuariogrupo', {
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