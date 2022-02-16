const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('grupo', {
        codigo: {
            autoIncrement: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        empresa: {
            type: Sequelize.STRING(9),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'empresa',
                key: 'nif'
            }
        },
        administrador: {
            type: Sequelize.STRING(30),
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'email'
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
        tableName: 'grupo',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "grupopk",
            unique: true,
            fields: [
                { name: "codigo" },
                { name: "empresa" },
            ]
        }, ]
    });
};