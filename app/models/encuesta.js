const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('encuesta', {
        autor: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true,
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
        nombre: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        descripcion: {
            type: Sequelize.STRING(200),
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'encuesta',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "encuestapk",
            unique: true,
            fields: [
                { name: "autor" },
                { name: "codigo" },
            ]
        }, ]
    });
};