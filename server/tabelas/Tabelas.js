const { Sequelize, DataTypes } = require('sequelize');
const conexao = require('../database/bancodados'); // Importar a conexão

// Modelo de Funcionario
const Funcionario = conexao.define('Funcionario', {
    idFuncionario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

// Modelo de Cliente
const Cliente = conexao.define('Cliente', {
    idCliente: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cpf: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

// Modelo de ChatAoVivo
const ChatAoVivo = conexao.define('ChatAoVivo', {
    idChat: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    dataInicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    idCliente: {
        type: DataTypes.INTEGER,
        references: {
            model: Cliente,
            key: 'idCliente'
        }
    },
    idFuncionario: {
        type: DataTypes.INTEGER,
        references: {
            model: Funcionario,
            key: 'idFuncionario'
        }
    },
    idMensagem: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Mensagem',
            key: 'idMensagem'
        }
    }
});

// Modelo de AgendamentoDeServico
const AgendamentoDeServico = conexao.define('AgendamentoDeServico', {
    idAgendamento: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    solicitacao: {
        type: DataTypes.DATE,
        allowNull: false
    },
    dataAgendada: {
        type: DataTypes.DATE,
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('E', 'A', 'C'),
        allowNull: false
    },
    idServico: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Servico',
            key: 'idServico'
        }
    },
    idFuncionario: {
        type: DataTypes.INTEGER,
        references: {
            model: Funcionario,
            key: 'idFuncionario'
        }
    },
    idCliente: {
        type: DataTypes.INTEGER,
        references: {
            model: Cliente,
            key: 'idCliente'
        }
    }
});

// Modelo de Servico
const Servico = conexao.define('Servico', {
    idServico: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    valor: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false
    },
    servico: {
        type: DataTypes.ENUM('L', 'R', 'P'),
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

// Modelo de Cortina
const Cortina = conexao.define('Cortina', {
    idCortina: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imagem: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tipo: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    material: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Modelo de Mensagem
const Mensagem = conexao.define('Mensagem', {
    idMensagem: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    dataHora: {
        type: DataTypes.DATE,
        allowNull: false
    },
    conteudo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagem: {
        type: DataTypes.STRING,
        allowNull: true
    },
    audio: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    visualizada: {
        type: DataTypes.ENUM('L', 'NL', 'NE'),
        allowNull: false
    }
});

// Modelo de Usuario com FKs para emails
const Usuario = conexao.define('Usuario', {
    idUsuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nivelUser: {
        type: DataTypes.ENUM('Func', 'Clien'),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

// Sincronizando as tabelas
const sincronizarTabelas = async () => {
    try {
        //await conexao.sync({ alter: true });
        console.log("Tabelas sincronizadas com sucesso.");
    } catch (erro) {
        console.error("Erro ao sincronizar tabelas: ", erro);
    }
};

sincronizarTabelas();

module.exports = {
    Funcionario,
    Cliente,
    ChatAoVivo,
    AgendamentoDeServico,
    Servico,
    Cortina,
    Mensagem,
    Usuario
};
