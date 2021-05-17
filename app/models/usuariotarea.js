const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('usuariotarea', {
        atareado: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'usuario',
                key: 'email'
            }
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
        tareacodigoproyecto: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'tarea',
                key: 'codigoproyecto'
            }
        },
        tareaadministradorproyecto: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'tarea',
                key: 'codigoproyecto'
            }
        }
    }, {
        sequelize,
        tableName: 'usuariotarea',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "usuariotareapk",
            unique: true,
            fields: [
                { name: "atareado" },
                { name: "tareacodigo" },
                { name: "tareacodigoproyecto" },
                { name: "tareaadministradorproyecto" },
            ]
        }, ]
    });
};