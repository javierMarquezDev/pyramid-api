const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('proyectousuario', {
        usuario: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'usuario',
                key: 'email'
            }
        },
        proyectocodigo: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'proyecto',
                key: 'codigo'
            }
        },
        proyectoadministrador: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'proyecto',
                key: 'codigo'
            }
        }
    }, {
        sequelize,
        tableName: 'proyectousuario',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "proyectousuariopk",
            unique: true,
            fields: [
                { name: "usuario" },
                { name: "proyectocodigo" },
                { name: "proyectoadministrador" },
            ]
        }, ]
    });
};