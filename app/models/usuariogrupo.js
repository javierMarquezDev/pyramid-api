const Sequelize = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    return sequelize.define('usuariogrupo', {
        usuario: {
            type: Sequelize.STRING(30),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'usuario',
                key: 'email'
            }
        },
        codigogrupo: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'grupo',
                key: 'empresa'
            }
        },
        empresagrupo: {
            type: Sequelize.STRING(9),
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'grupo',
                key: 'empresa'
            }
        },
        administrador: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        sequelize,
        tableName: 'usuariogrupo',
        schema: 'public',
        timestamps: false,
        indexes: [{
            name: "usuariogrupopk",
            unique: true,
            fields: [
                { name: "usuario" },
                { name: "codigogrupo" },
                { name: "empresagrupo" },
            ]
        }, ]
    });
};