const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('empresa', {
        nif: {
            type: Sequelize.STRING(9),
            allowNull: false,
            primaryKey: true
        },
        razonsocial: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        nombre: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        administrador: {
            type: Sequelize.STRING(30),
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'email'
            }
        },
        tipovia: {
            type: Sequelize.STRING(10),
            allowNull: false
        },
        nombrevia: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        numvia: {
            type: Sequelize.STRING(6),
            allowNull: false
        },
        codigopuerta: {
            type: Sequelize.STRING(5),
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'empresa',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "empresa_pkey",
            unique: true,
            fields: [
                { name: "nif" },
            ]
        }, ]
    });
};