const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('encuestausuario', {
        encuestaautor: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'encuesta',
                key: 'codigo'
            }
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
        encuestado: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'usuario',
                key: 'email'
            }
        }
    }, {
        sequelize,
        tableName: 'encuestausuario',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "encuestausuariopk",
            unique: true,
            fields: [
                { name: "encuestaautor" },
                { name: "encuestacodigo" },
                { name: "encuestado" },
            ]
        }, ]
    });
};