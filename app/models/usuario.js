const bcrypt = require('bcrypt')
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
        },
        provincia: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        localidad: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        counter: {
            type: Sequelize.VIRTUAL
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

    Usuario.generateHash = function(value) {
        return bcrypt.hashSync(value, bcrypt.genSaltSync(10), null)
    }
    Usuario.decrypt = function(value,encrypted) {
        return bcrypt.compareSync(value,encrypted);
    }

    return Usuario;
};