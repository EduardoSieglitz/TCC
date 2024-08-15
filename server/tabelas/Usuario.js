const sequelize = require('sequelize'),
    conexao = require('../database/bancodados.js'),
    usuario = conexao.define("usuario", {
        id_usuario: {
            type: sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nome: {
            type: sequelize.STRING,
            allowNull: false
        },
        email: {
            type: sequelize.STRING,
            allowNull: false
        },
        senha: {
            type: sequelize.STRING,
            allowNull: false
        },
        datanascimento: {
            type: sequelize.STRING,
            allowNull: false
        },
        nivel: {
            type: sequelize.STRING,
            allowNull: false
        },
    });

const tabelaUsuario = async () => {
    try {
        const resul = await conexao.query("SELECT 1 FROM information_schema.tables WHERE table_schema = 'PCIC' AND table_name = 'usuario';");

        if (resul[0].length === 0) {
            await cliente.sync();
            console.log("Tabela 'usuario' criada");
        } else {
            console.log("Tabela 'usuario' já existe");
        }
    } catch (erro) {
        console.error("Erro ao verificar/criar tabela: ", erro);
    }
}
tabelaUsuario();
module.exports = usuario;