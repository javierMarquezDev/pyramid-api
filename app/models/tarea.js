const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('tarea', {
        codigo: {
            autoIncrement: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        codigoproyecto: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'proyecto',
                key: 'codigo'
            }
        },
        administradorproyecto: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'proyecto',
                key: 'codigo'
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
        }
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