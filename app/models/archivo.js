const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('archivo', {
        codigo: {
            autoIncrement: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        tareacodigo: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'tarea',
                key: 'codigoproyecto'
            }
        },
        tareagrupocodigo: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'tarea',
                key: 'grupocodigo'
            }
        },
        tareagrupoempresa: {
            type: Sequelize.STRING(9),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'tarea',
                key: 'grupoempresa'
            }
        },
        archivo: {
            type: "BYTEA",
            allowNull: true
        },
        maxsizekb: {
            type: Sequelize.REAL,
            allowNull: false
        },
        fileextletters: {
            type: Sequelize.STRING(4),
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'archivo',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "archivopk",
            unique: true,
            fields: [
                { name: "codigo" },
                { name: "tareacodigo" },
                { name: "tareacodigoproyecto" },
                { name: "tareaadministradorproyecto" },
            ]
        }, ]
    });
};