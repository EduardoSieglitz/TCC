const { json } = require("body-parser"),
  express = require("express"),
  app = express(),
  db = require("./database/pool"),
  cors = require("cors"),
  tabelas = require("./tabelas/Tabelas");

app.use(cors());
app.use(json());

//Cadastro de Cliente
app.post("/registrar", async (req, res) => {
  const { nome, email, senha, telefone, cpf, endereco } = req.body;
  const Usuario = "Clien";
  const sqlClienteS = `
    SELECT * 
    FROM cliente 
    WHERE email = ? OR cpfClien = ? OR telefone = ?;
  `;
  const sqlFuncionarioS = `
    SELECT * 
    FROM funcionario 
    WHERE email = ? OR cpfFunc = ? OR telefone = ?;
  `;
  const sqlCliente = `
    INSERT INTO cliente(nome, cpfClien, senha, email, telefone, endereco) 
    VALUES(?, ?, ?, ?, ?, ?);
  `;
  const sqlUsuario = `
    INSERT INTO usuario(nivelUser, email, senha) 
    VALUES(?, ?, ?);
  `;
  try {
    const [funcionarioResult] = await db.query(sqlFuncionarioS, [email, cpf, telefone]);

    if (funcionarioResult.length > 0) {
      if (funcionarioResult[0].email === email) return res.json("Email");
      if (funcionarioResult[0].cpfFunc === cpf) return res.json("CPF");
      if (funcionarioResult[0].telefone === telefone) return res.json("Telefone");
    }
    const [clienteResult] = await db.query(sqlClienteS, [email, cpf, telefone]);
    if (clienteResult.length > 0) {
      if (clienteResult[0].email === email) return res.json("Email");
      if (clienteResult[0].cpfClien === cpf) return res.json("CPF");
      if (clienteResult[0].telefone === telefone) return res.json("Telefone");
    }
    await db.query(sqlCliente, [nome, cpf, senha, email, telefone, endereco]);
    await db.query(sqlUsuario, [Usuario, email, senha]);
    return res.json("Cadastrado");
  } catch (error) {
    console.error("Erro ao registrar o cliente:", error);
    return res.status(500).json("Error");
  }
});
//

//Cadastro Funcionario
app.post("/registrarfunc", async (req, res) => {
  const { nome, email, senha, telefone, cpf, descricao } = req.body;
  const Usuario = "Func";
  const sqlFuncionarioS = `
    SELECT * 
    FROM funcionario 
    WHERE email = ? OR cpffunc = ? OR telefone = ?;
  `;
  const sqlClienteS = `
    SELECT * 
    FROM cliente 
    WHERE email = ? OR cpfclien = ? OR telefone = ?;
  `;
  const sqlFuncionario = `
    INSERT INTO funcionario(nome, cpffunc, senha, email, telefone, descricao) 
    VALUES(?, ?, ?, ?, ?, ?);
  `;
  const sqlUsuario = `
    INSERT INTO usuario(nivelUser, email, senha) 
    VALUES(?, ?, ?);
  `;
  try {
    const [funcionarioResult] = await db.query(sqlFuncionarioS, [email, cpf, telefone]);
    if (funcionarioResult.length > 0) {
      if (funcionarioResult[0].email === email) return res.json("Email");
      if (funcionarioResult[0].cpfFunc === cpf) return res.json("CPF");
      if (funcionarioResult[0].telefone === telefone) return res.json("Telefone");
    }
    const [clienteResult] = await db.query(sqlClienteS, [email, cpf, telefone]);
    if (clienteResult.length > 0) {
      if (clienteResult[0].email === email) return res.json("Email");
      if (clienteResult[0].cpfClien === cpf) return res.json("CPF");
      if (clienteResult[0].telefone === telefone) return res.json("Telefone");
    }
    await db.query(sqlFuncionario, [nome, cpf, senha, email, telefone, descricao]);
    await db.query(sqlUsuario, [Usuario, email, senha]);
    return res.json("Cadastrado");
  } catch (error) {
    console.error("Erro ao registrar o funcionário:", error);
    return res.status(500).json("Error");
  }
});
//

//Cadastro Agendamento
app.post("/registraragendamento", async (req, res) => {
  const dataAtual = new Date();
  const hora = dataAtual.getHours();   // Pega a hora atual
  const minutos = dataAtual.getMinutes(); // Pega os minutos atuais
  const segundos = dataAtual.getSeconds(); // Pega os segundos atuais

  const { solicitacao, dataAgendada, descricao, servico, cpfFunc, cpfClien, status, valor } = req.body;

  const sqlsAgendamento = "INSERT INTO agendamentodeservico(solicitacao, dataAgendada, descricao, status, idServico, idFuncionario, idCliente) VALUES(?, ?, ?, ?, ?, ?, ?)";
  const sqlServico = "INSERT INTO servico(valor, servico) VALUES(?, ?)";
  const sqlPesquisaClien = "SELECT * FROM cliente WHERE cpfclien = ?";
  const sqlPesquisaFunc = "SELECT * FROM funcionario WHERE cpfFunc = ?";

  try {
    const [clienteResults] = await db.query(sqlPesquisaClien, [cpfClien]);
    if (clienteResults.length === 0) {
      return res.status(404).json("Cliente não encontrado.");
    }
    const idCliente = clienteResults[0].idCliente;

    const [funcionarioResults] = await db.query(sqlPesquisaFunc, [cpfFunc]);
    if (funcionarioResults.length === 0) {
      return res.status(404).json("Funcionário não encontrado.");
    }
    const idFuncionario = funcionarioResults[0].idFuncionario;

    const [servicoInsertResult] = await db.query(sqlServico, [valor, servico]);
    const idServico = servicoInsertResult.insertId;

    await db.query(sqlsAgendamento, [
      `${solicitacao} ${hora}:${minutos}:${segundos}`,
      `${dataAgendada} ${hora}:${minutos}:${segundos}`,
      descricao,
      status,
      idServico,
      idFuncionario,
      idCliente
    ]);

    return res.json("Cadastrado");
  } catch (error) {
    console.log("Erro ao registrar agendamento:", error);
    return res.status(500).json({ error: "Erro no servidor ao registrar o agendamento." });
  }
});
//

//Tabela Agendamento 
app.post("/tabelaagendamentos", async (req, res) => {
  const sql = `SELECT a.idAgendamento, a.solicitacao, a.dataAgendada, a.descricao,
   a.status, s.valor, s.servico, c.cpfClien, f.cpfFunc FROM agendamentodeservico a LEFT 
  JOIN servico s ON a.idAgendamento = s.idServico LEFT JOIN cliente c ON a.idCliente = 
  c.idCliente LEFT JOIN funcionario f ON a.idFuncionario = f.idFuncionario;`;
  try {
    const [result] = await db.query(sql);
    return res.json(result);
  } catch (erro) {
    return res.json("error");
  }
});
//

//Login de Usuario
app.post("/login/auth", async (req, res) => {
  const { email, senha } = req.body;

  const sqlFuncionario = `
    SELECT f.idFuncionario, f.email, f.senha, u.nivelUser
    FROM funcionario f
    LEFT JOIN usuario u ON f.email = u.email
    WHERE f.email = ? AND f.senha = ?`;

  const sqlCliente = `
    SELECT c.idCliente, c.email, c.senha, u.nivelUser
    FROM cliente c
    LEFT JOIN usuario u ON c.email = u.email
    WHERE c.email = ? AND c.senha = ?`;

  try {
    const [clienteResult] = await db.query(sqlCliente, [email, senha]);

    if (clienteResult.length > 0) {
      return res.json({ token: true, dados: clienteResult });
    }
    const [funcionarioResult] = await db.query(sqlFuncionario, [email, senha]);

    if (funcionarioResult.length > 0) {
      return res.json({ token: true, dados: funcionarioResult });
    }
    return res.json({ token: false, dados: [{ nivelUser: "error" }] });

  } catch (error) {
    console.error("Erro ao realizar a consulta no banco de dados:", error);
    return res.status(500).json({ token: false, dados: [{ nivelUser: "error" }] });
  }
});
//

//Tabelas Funcionario
app.post("/tabelafuncionario", async (req, res) => {
  const sql = "SELECT * FROM funcionario";
  try {
    const [result] = await db.query(sql);
    return res.json(result);
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
    return res.status(500).json({ message: "Erro ao buscar funcionários." });
  }
});

//Tabelas Cliente
app.post("/tabelacliente", async (req, res) => {
  const sql = "SELECT * FROM cliente";
  try {
    const [result] = await db.query(sql);
    return res.json(result);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return res.status(500).json({ message: "Erro ao buscar clientes." });
  }
});


//Delete Cliente
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const sqlUsuario = "DELETE FROM usuario WHERE idUsuario = ?;";
  const sqlCliente = "DELETE FROM cliente WHERE idCliente = ?;";
  try {
    await db.query(sqlCliente, [id]);
    await db.query(sqlUsuario, [id]);
    return res.json({ message: "Cliente deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    return res.status(500).json({ message: "Erro ao deletar cliente.", error });
  }
});
//

//Editar Cliente
app.put("/editar/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, telefone, cpf, endereco } = req.body;
  const sqlUpdateCliente = `
    UPDATE cliente 
    SET nome = ?, email = ?, senha = ?, telefone = ?, cpf = ?, endereco = ? 
    WHERE idCliente = ?`;
  const sqlUpdateUsuario = `
    UPDATE usuario 
    SET email = ?, senha = ? 
    WHERE email = (SELECT email FROM cliente WHERE idCliente = ?)`;
  const sqlCheckDuplicates = `
    SELECT * 
    FROM cliente 
    WHERE (email = ? OR cpf = ? OR telefone = ?) AND idCliente != ?`;
  try {
    const [result] = await db.query(sqlCheckDuplicates, [email, cpf, telefone, id]);
    if (result.length > 0) {
      const existingUser = result[0];
      if (existingUser.email === email) return res.json("Email já existente.");
      if (existingUser.cpf === cpf) return res.json("CPF já existente.");
      if (existingUser.telefone === telefone) return res.json("Telefone já existente.");
    }
    await db.query(sqlUpdateCliente, [nome, email, senha, telefone, cpf, endereco, id]);
    await db.query(sqlUpdateUsuario, [email, senha, id]);
    return res.json("Cliente atualizado com sucesso.");
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return res.status(500).json({ message: "Erro ao atualizar cliente.", error });
  }
});
//

//Delete Funcionario
app.delete("/deletefunc/:id", async (req, res) => {
  const { id } = req.params;
  const sqlDeleteUsuario = "DELETE FROM usuario WHERE idUsuario = ?;";
  const sqlDeleteFuncionario = "DELETE FROM funcionario WHERE idFuncionario = ?;";
  try {
    await db.query(sqlDeleteFuncionario, [id]);
    await db.query(sqlDeleteUsuario, [id]);
    return res.json({ message: "Funcionário deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar funcionário:", error);
    return res.status(500).json({ message: "Erro ao deletar funcionário.", error });
  }
});
//

//Editar Funcionario
app.put("/editarfunc/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, telefone, cpf, descricao } = req.body;

  const sqlUpdateFuncionario = `
    UPDATE funcionario 
    SET nome = ?, email = ?, senha = ?, telefone = ?, cpf = ?, descricao = ? 
    WHERE idFuncionario = ?`;
  const sqlUpdateUsuario = `
    UPDATE usuario 
    SET email = ?, senha = ? 
    WHERE email = (SELECT email FROM funcionario WHERE idFuncionario = ?)`;
  const sqlCheckDuplicates = `
    SELECT * 
    FROM funcionario 
    WHERE (email = ? OR cpf = ? OR telefone = ?) AND idFuncionario != ?`;
  try {
    const [result] = await db.query(sqlCheckDuplicates, [email, cpf, telefone, id]);
    if (result.length > 0) {
      const existingUser = result[0];
      if (existingUser.email === email) return res.json("Email já existente.");
      if (existingUser.cpf === cpf) return res.json("CPF já existente.");
      if (existingUser.telefone === telefone) return res.json("Telefone já existente.");
    }
    await db.query(sqlUpdateFuncionario, [nome, email, senha, telefone, cpf, descricao, id]);
    await db.query(sqlUpdateUsuario, [email, senha, id]);
    return res.json("Funcionário atualizado com sucesso.");
  } catch (error) {
    console.error("Erro ao atualizar funcionário:", error);
    return res.status(500).json({ message: "Erro ao atualizar funcionário.", error });
  }
});

app.listen(3001, () => {
  console.log("Servidor rodando...");
})