const sequelize = require('sequelize'),
    conexao = require('../database/bancodados.js'),
    cliente = conexao.define("admin", {
        id_admin: {
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
        cpf: {
            type: sequelize.STRING,
            allowNull: false
        },
        datanascimento: {
            type: sequelize.STRING,
            allowNull: false
        },
    });

const tabelaAdmin = async () => {
    try {
        const resul = await conexao.query("SELECT 1 FROM information_schema.tables WHERE table_schema = 'PCIC' AND table_name = 'admin';");

        if (resul[0].length === 0) {
            await cliente.sync();
            console.log("Tabela 'admin' criada");
        } else {
            console.log("Tabela 'admin' já existe");
        }
    } catch (erro) {
        console.error("Erro ao verificar/criar tabela: ", erro);
    }
}
tabelaAdmin();
module.exports = cliente;