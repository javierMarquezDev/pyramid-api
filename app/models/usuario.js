const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    const Usuario = sequelize.define('usuario', {
        email: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true
        },
        contrasena: {
            type: Sequelize.STRING(60),
            allowNull: false
        },
        dni: {
            type: Sequelize.STRING(9),
            allowNull: true,
            unique: "usuario_dni_key"
        },
        nombre: {
            type: Sequelize.STRING(35),
            allowNull: false
        },
        apellido1: {
            type: Sequelize.STRING(35),
            allowNull: false
        },
        apellido2: {
            type: Sequelize.STRING(35),
            allowNull: true
        },
        tipovia: {
            type: Sequelize.STRING(10),
            allowNull: false
        },
        nombrevia: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        numvia: {
            type: Sequelize.STRING(6),
            allowNull: false
        },
        codigopuerta: {
            type: Sequelize.STRING(5),
            allowNull: true
        },
        notificaciones: {
            type: Sequelize.JSON,
            allowNull: false,
            defaultValue: {}
        }
    }, {
        sequelize,
        tableName: 'usuario',
        schema: 'public',
        timestamps: false,
        indexes: [{
                name: "usuario_dni_key",
                unique: true,
                fields: [
                    { name: "dni" },
                ]
            },
            {
                name: "usuario_pkey",
                unique: true,
                fields: [
                    { name: "email" },
                ]
            },
        ]
    });
    return Usuario;
};