const sequelize = require('sequelize');
const conexao = require('../database/bancodados.js');

// Tabela Usuario
const Usuario = conexao.define('usuario', {
    idUsuario: {
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
        allowNull: false,
    },
    senha: {
        type: sequelize.STRING,
        allowNull: false
    },
    telefone: {
        type: sequelize.STRING,
        allowNull: false,
    },
    inicioLogin: {
        type: sequelize.DATE,
        allowNull: true
    },
    fimLogin: {
        type: sequelize.DATE,
        allowNull: true
    },
    nivel: {
        type: sequelize.ENUM('Func', 'Clien'),
        allowNull: false
    }

});

// Tabela Agendamento
const Agendamento = conexao.define('agendamento', {
    idAgendamento: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    solicitacao: {
        type: sequelize.DATE,
        allowNull: false
    },
    dataAgendada: {
        type: sequelize.DATE,
        allowNull: false
    },
    status: {
        type: sequelize.ENUM('E', 'A', 'C'),
        allowNull: false
    },
    servico: {
        type: sequelize.ENUM('L', 'R', 'P'),
        allowNull: false
    },
    descricao: {
        type: sequelize.STRING,
        allowNull: false
    },
    idUsuario: {
        type: sequelize.INTEGER,
        references: {
            model: Usuario,
            key: 'idUsuario'
        },
        allowNull: false
    }
});

// Tabela Mensagem
const Mensagem = conexao.define('mensagem', {
    idMensagem: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    dataHora: {
        type: sequelize.DATE,
        allowNull: false
    },
    conteudo: {
        type: sequelize.STRING,
        allowNull: false
    }
});
// Tabela Chat ao Vivo
const ChatAoVivo = conexao.define('chat_aovivo', {
    idChat: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    dataInicio: {
        type: sequelize.DATE,
        allowNull: false
    },
    idUsuario: {
        type: sequelize.INTEGER,
        references: {
            model: Usuario,
            key: 'idUsuario'
        },
        allowNull: false
    },
    idMensagem: {
        type: sequelize.INTEGER,
        references: {
            model: Mensagem,
            key: 'idMensagem'
        },
        allowNull: false
    }
});
// Tabela Cortina
const Cortina = conexao.define('cortina', {
    idCortina: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: sequelize.STRING,
        allowNull: false
    },
    imagem: {
        type: sequelize.STRING,
        allowNull: false
    },
    tipo: {
        type: sequelize.STRING,
        allowNull: false
    },
    material: {
        type: sequelize.STRING,
        allowNull: false
    },
    categoriaMaterial: {
        type: sequelize.STRING,
        allowNull: false
    }
});

// Tabela ControleCortina
const ControleCortina = conexao.define('controle_cortina', {
    idControle: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    idUsuario: {
        type: sequelize.INTEGER,
        references: {
            model: Usuario,
            key: 'idUsuario'
        },
        allowNull: false
    },
    idCortina: {
        type: sequelize.INTEGER,
        references: {
            model: Cortina,
            key: 'idCortina'
        },
        allowNull: false
    }
});

// Sincronizando as tabelas
const sincronizarTabelas = async () => {
    try {
        await conexao.sync({ alter: true });
        console.log("Tabelas sincronizadas com sucesso.");
    } catch (erro) {
        console.error("Erro ao sincronizar tabelas: ", erro);
    }
};

sincronizarTabelas();

module.exports = {
    Usuario,
    Agendamento,
    Mensagem,
    ChatAoVivo,
    Cortina,
    ControleCortina
};
