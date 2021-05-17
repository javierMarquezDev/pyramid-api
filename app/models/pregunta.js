const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('pregunta', {
        codigo: {
            autoIncrement: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        encuestacodigo: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'encuesta',
                key: 'codigo'
            }
        },
        encuestaautor: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'encuesta',
                key: 'codigo'
            }
        },
        enunciado: {
            type: Sequelize.STRING(200),
            allowNull: false
        },
        respuestas: {
            type: Sequelize.JSON,
            allowNull: true,
            defaultValue: {}
        }
    }, {
        sequelize,
        tableName: 'pregunta',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "preguntapk",
            unique: true,
            fields: [
                { name: "codigo" },
                { name: "encuestacodigo" },
                { name: "encuestaautor" },
            ]
        }, ]
    });
};