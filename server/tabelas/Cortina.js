const sequelize = require('sequelize'),
    conexao = require('../database/bancodados.js'),
    usuario = require("./Usuario.js"),
    cortinas = conexao.define("cortinas", {
        id_cortinas: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        material: {
            type: sequelize.STRING,
            allowNull: false
        },
        descrição: {
            type: sequelize.TEXT,
            allowNull: false
        },
        precos: {
            type: sequelize.STRING,
            allowNull: false
        },
        imagens: {
            type: sequelize.STRING,
            allowNull: false
        },
        id_cortinas: {
            type: sequelize.INTEGER,
            allowNull: false
        }
    });
    usuario.hasMany(cortinas, {
        foreignKey: 'id_usuario',
      });
      
      cortinas.belongsTo(usuario, {
        foreignKey: ' id_usuario',
        as: 'usuario'
      });

const tabelaCortinas = async () => {
    try {
        const resul = await conexao.query("SELECT 1 FROM information_schema.tables WHERE table_schema = 'PCIC' AND table_name = 'cortinas';");

        if (resul[0].length === 0) {
            await cortinas.sync();
            console.log("Tabela 'cortinas' criada");
        } else {
            console.log("Tabela 'cortinas' já existe");
        }
    } catch (erro) {
        console.error("Erro ao verificar/criar tabela: ", erro);
    }
}
tabelaCortinas();
module.exports = cortinas;