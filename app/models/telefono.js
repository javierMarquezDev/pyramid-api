const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('telefono', {
        telefono: {
            type: Sequelize.STRING(12),
            allowNull: false,
            primaryKey: true
        },
        usuario: {
            type: Sequelize.STRING(30),
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'email'
            }
        },
        empresa: {
            type: Sequelize.STRING(9),
            allowNull: false,
            references: {
                model: 'empresa',
                key: 'nif'
            }
        }
    }, {
        sequelize,
        tableName: 'telefono',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "telefono_pkey",
            unique: true,
            fields: [
                { name: "telefono" },
            ]
        }, ]
    });
};