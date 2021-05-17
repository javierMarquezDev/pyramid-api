const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('mensaje', {
        remitente: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'usuario',
                key: 'email'
            }
        },
        destinatario: {
            type: Sequelize.STRING(30),
            allowNull: true,
            references: {
                model: 'usuario',
                key: 'email'
            }
        },
        codigo: {
            autoIncrement: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        fechahora: {
            type: Sequelize.DATE,
            allowNull: false
        },
        texto: {
            type: Sequelize.STRING(1000),
            allowNull: false
        },
        imagen: {
            type: "BYTEA",
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'mensaje',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "mensajepk",
            unique: true,
            fields: [
                { name: "remitente" },
                { name: "codigo" },
            ]
        }, ]
    });
};