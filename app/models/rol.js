const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('rol', {
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
        tableName: 'rol',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "rol_pkey",
            unique: true,
            fields: [
                { name: "codigo" },
            ]
        }, ]
    });
};