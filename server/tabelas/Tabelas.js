const sequelize = require('sequelize');
const conexao = require('../database/bancodados.js');

// Tabelas
// Cliente
const Cliente = conexao.define('cliente', {
    idCliente: {
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
    telefone: {
        type: sequelize.STRING,
        allowNull: false
    },
    datanascimento: {
        type: sequelize.DATE,
        allowNull: false
    },
    status: {
        type: sequelize.ENUM("a", "i"),
        allowNull: false
    }
});

// Funcionário
const Funcionario = conexao.define('funcionario', {
    idFuncionario: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: sequelize.STRING,
        allowNull: false
    }
});

// Mensagem
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
    },
    remetente: {
        type: sequelize.INTEGER,
        references: {
            model: Funcionario,
            key: 'idFuncionario'
        },
        allowNull: false
    },
    destinatario: {
        type: sequelize.INTEGER,
        references: {
            model: Cliente,
            key: 'idCliente'
        },
        allowNull: false
    }
});

// Chat ao Vivo
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
    idCliente: {
        type: sequelize.INTEGER,
        references: {
            model: Cliente,
            key: 'idCliente'
        },
        allowNull: false
    },
    idFuncionario: {
        type: sequelize.INTEGER,
        references: {
            model: Funcionario,
            key: 'idFuncionario'
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

// Agenda Funcionário
const AgendaFuncionario = conexao.define('agenda_funcionario', {
    idFuncionario: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: Funcionario,
            key: 'idFuncionario'
        }
    },
    nome: {
        type: sequelize.STRING,
        allowNull: false
    },
    cpf: {
        type: sequelize.STRING,
        allowNull: false
    },
    datanascimento: {
        type: sequelize.DATE,
        allowNull: false
    },
    inicioHorarioTrabalho: {
        type: sequelize.DATE,
        allowNull: false
    },
    fimHorarioTrabalho: {
        type: sequelize.DATE,
        allowNull: false
    }
});

// Agendamento
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
        type: sequelize.ENUM("E", "A", "C"),
        allowNull: false
    },
    servico: {
        type: sequelize.ENUM("L", "R", "P"),
        allowNull: false
    },
    descricao: {
        type: sequelize.STRING,
        allowNull: false
    },
    idCliente: {
        type: sequelize.INTEGER,
        references: {
            model: Cliente,
            key: 'idCliente'
        },
        allowNull: false
    }
});

// Cortina
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

// Pagamento
const Pagamento = conexao.define('pagamento', {
    idCompra: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    valorTotal: {
        type: sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    idAgendamento: {
        type: sequelize.INTEGER,
        references: {
            model: Agendamento,
            key: 'idAgendamento'
        },
        allowNull: false
    },
    idCliente: {
        type: sequelize.INTEGER,
        references: {
            model: Cliente,
            key: 'idCliente'
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
    },
    idChat: {
        type: sequelize.INTEGER,
        references: {
            model: ChatAoVivo,
            key: 'idChat'
        },
        allowNull: false
    }
});

// Forma de Pagamento
const FormaPagamento = conexao.define('forma_pagamento', {
    idCompra: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    valorTotal: {
        type: sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    Tipo: {
        type: sequelize.ENUM("Reforma", "Lavagem", "Cortina"),
        allowNull: false
    },
    idCliente: {
        type: sequelize.INTEGER,
        references: {
            model: Cliente,
            key: 'idCliente'
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
    },
    idChat: {
        type: sequelize.INTEGER,
        references: {
            model: ChatAoVivo,
            key: 'idChat'
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
    Cliente,
    Funcionario,
    Mensagem,
    ChatAoVivo,
    AgendaFuncionario,
    Agendamento,
    Cortina,
    Pagamento,
    FormaPagamento
};
