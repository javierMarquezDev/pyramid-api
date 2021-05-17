const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('proyecto', {
        administrador: {
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
        },
        fechahora: {
            type: Sequelize.DATE,
            allowNull: true
        },
        finalizado: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        sequelize,
        tableName: 'proyecto',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "proyectopk",
            unique: true,
            fields: [
                { name: "administrador" },
                { name: "codigo" },
            ]
        }, ]
    });
};