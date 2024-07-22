const sequelize = require('sequelize'),
    conexao = require('./bancodados.js'),
    cliente = conexao.define("cliente", {
        id_cliente: {
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
    });

const tabelaCliente = async () => {
    try {
        const resul = await conexao.query("SELECT 1 FROM information_schema.tables WHERE table_schema = 'lojacomprastcc' AND table_name = 'cliente';");

        if (resul[0].length === 0) {
            await cliente.sync();
            console.log("Tabela 'cliente' criada");
        } else {
            console.log("Tabela 'cliente' já existe");
        }
    } catch (erro) {
        console.error("Erro ao verificar/criar tabela: ", erro);
    }
}
tabelaCliente();
module.exports = cliente;