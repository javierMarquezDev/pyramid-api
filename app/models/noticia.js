const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('noticia', {
        codigo: {
            autoIncrement: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        autor: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'usuario',
                key: 'email'
            }
        },
        grupocodigo: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'grupo',
                key: 'empresa'
            }
        },
        grupoempresa: {
            type: Sequelize.STRING(9),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'grupo',
                key: 'empresa'
            }
        },
        texto: {
            type: Sequelize.STRING(400),
            allowNull: false
        },
        fechahora: {
            type: Sequelize.DATE,
            allowNull: false
        },
        imagen1: {
            type: "BYTEA",
            allowNull: true
        },
        imagen2: {
            type: "BYTEA",
            allowNull: true
        },
        imagen3: {
            type: "BYTEA",
            allowNull: true
        },
        imagen4: {
            type: "BYTEA",
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'noticia',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "noticiapk",
            unique: true,
            fields: [
                { name: "codigo" },
                { name: "autor" },
                { name: "grupocodigo" },
                { name: "grupoempresa" },
            ]
        }, ]
    });
};