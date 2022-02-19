const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('tarea', {
        codigo: {
            autoIncrement: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        grupocodigo: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'grupo',
                key: 'codigo'
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
        nombre: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        descripcion: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        checked: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        fechahora: {
            type: Sequelize.DATE,
            allowNull: true
        },
        usuario: {
            type: Sequelize.STRING(30),
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'email'
            }
        },
    }, {
        sequelize,
        tableName: 'tarea',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "tareapk",
            unique: true,
            fields: [
                { name: "codigo" },
                { name: "codigoproyecto" },
                { name: "administradorproyecto" },
            ]
        }, ]
    });
};