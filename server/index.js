require('dotenv').config();
const { json } = require("body-parser"),
  express = require("express"),
  cors = require("cors"),
  compression = require('compression'),
  fs = require("fs"),
  app = express(),
  db = require("./database/pool"),
  path = require("path"),
  tabelas = require("./tabelas/Tabelas"),
  upload = require("./upload/filecofig"),
  upload2 = require("./upload/filecofig2"),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken'),
  nodemailer = require('nodemailer');

app.use(cors());
app.use(json());
app.use(compression());
app.use(express.static(path.join(__dirname, "upload")));

const generateResetToken = (email) => {
  return jwt.sign({ email }, 'secret_key', { expiresIn: '1h' });
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'eduardosieglitzdasilveira@gmail.com',
    pass: 'wzls nqtv srvn bugg'
  }
});

//Solicitar recuperação de senha
app.post('/requestreset', async (req, res) => {
  const { email } = req.body;
  const sqlSearchUser = `SELECT * FROM cliente WHERE email = ?`;

  try {
    const [userResult] = await db.query(sqlSearchUser, [email]);

    if (userResult.length === 0) {
      return res.json('Usuário não encontrado');
    }
    const token = generateResetToken(email);
    const mailOptions = {
      from: 'eduardosieglitzdasilveira@gmail.com',
      to: email,
      subject: 'Recuperação de Senha',
      text: `Use este token para redefinir sua senha: ${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      console.log("Erro");
      if (error) {
        return res.json('Erro ao enviar email');
      }
      res.json('Email enviado com sucesso!');
    });

  } catch (error) {
    console.log('Erro ao solicitar recuperação de senha:' + error);
    res.json('Erro no servidor');
  }
});

// Redefinir a senha usando o token
app.post('/resetpassword', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, "secret_key");
    const email = decoded.email;

    const sqlVerifyUser = `SELECT * FROM usuario WHERE email = ?`;
    const [userResult] = await db.query(sqlVerifyUser, [email]);

    if (userResult.length === 0) {
      return res.json('Usuário não encontrado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const sqlUpdatePassword = `UPDATE usuario SET senha = ? WHERE email = ?`;
    await db.query(sqlUpdatePassword, [hashedPassword, email]);

    res.json('Senha alterada com sucesso!');
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.json('Token expirado');
    } else if (error.name === 'JsonWebTokenError') {
      return res.json('Token inválido');
    }
    console.error('Erro ao redefinir a senha:', error);
    return res.json('Erro ao processar solicitação');
  }
});

//Login de Usuario
app.post("/login/auth", async (req, res) => {
  const { email, senha } = req.body;

  const sqlFuncionario = `
    SELECT f.idFuncionario, u.idUsuario, f.email, u.senha, u.nivelUser
    FROM funcionario f
    LEFT JOIN usuario u ON f.email = u.email
    WHERE f.email = ?`;

  const sqlCliente = `
    SELECT c.idCliente, u.idUsuario, c.email, u.senha, u.nivelUser
    FROM cliente c
    LEFT JOIN usuario u ON c.email = u.email
    WHERE c.email = ?`;

  try {
    const [clienteResult] = await db.query(sqlCliente, [email]);
    if (clienteResult.length > 0) {
      const isPasswordMatch = await bcrypt.compare(senha, clienteResult[0].senha);
      if (isPasswordMatch) {
        return res.json({ token: true, dados: clienteResult });
      }
    }
    const [funcionarioResult] = await db.query(sqlFuncionario, [email]);
    if (funcionarioResult.length > 0) {
      const isPasswordMatch = await bcrypt.compare(senha, funcionarioResult[0].senha);
      if (isPasswordMatch) {
        return res.json({ token: true, dados: funcionarioResult });
      }
    }

    return res.json({ token: false, dados: [{ nivelUser: "error" }] });

  } catch (error) {
    console.error("Erro ao realizar a consulta no banco de dados:", error);
    return res.status(500).json({ token: false, dados: [{ nivelUser: "error" }] });
  }
});
//

// Confirma Senha
app.post("/confirmarsenha", async (req, res) => {
  const { senha, id, nivel } = req.body;
  console.log(senha, id, nivel)
  let sqlUsuario = "";
  if (nivel == "Clien") {
    sqlUsuario = `SELECT u.senha FROM cliente c LEFT JOIN usuario u ON u.email = c.email WHERE idCliente = ?;`;
  } else {
    sqlUsuario = `SELECT u.senha FROM funcionario LEFT JOIN usuario u ON u.email = f.email WHERE idFuncionario = ?;`;
  }
  try {

    const [result] = await db.query(sqlUsuario, [id]);
    if (result.length > 0) {
      const isPasswordMatch = await bcrypt.compare(senha, result[0].senha);
      if (isPasswordMatch) {
        return res.json("Liberado");
      }
    }

    return res.json("Senha Incorreta");
  } catch (error) {
    console.error("Erro ao realizar a consulta no banco de dados:", error);
    return res.status(500).json("error");
  }
});
//

// Confirma Senha Funcionario
app.post("/confirmarsenhafunc", async (req, res) => {
  const { senha, id } = req.body;
  console.log(senha, id)
  const sqlUsuario = `SELECT u.senha FROM funcionario LEFT JOIN usuario u ON u.email = f.email WHERE idFuncionario = ?;`;
  try {
    const [result] = await db.query(sqlUsuario, [id]);
    if (result.length > 0) {
      const isPasswordMatch = await bcrypt.compare(senha, result[0].senha);
      if (isPasswordMatch) {
        return res.json("Liberado");
      }
    }

    return res.json("Senha Incorreta");
  } catch (error) {
    console.error("Erro ao realizar a consulta no banco de dados:", error);
    return res.status(500).json("error");
  }
});
//

//Cadastro de Cliente
app.post("/registrar", async (req, res) => {
  const { nome, email, senha, telefone, cpf, rua, estado, cidade, cep, numero, bairro } = req.body;
  const Usuario = "Clien";
  const sqlClienteS = `SELECT * FROM cliente WHERE email = ? OR cpfClien = ? OR telefone = ?;`;
  const sqlFuncionarioS = `SELECT * FROM funcionario WHERE email = ? OR cpfFunc = ? OR telefone = ?;`;
  const sqlCliente = `INSERT INTO cliente(nome, cpfClien, email, telefone, rua, estado, cidade, cep, numero, bairro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  const sqlUsuario = `INSERT INTO usuario(nivelUser, email, senha) VALUES(?, ?, ?);`;
  const sqlChat = `INSERT INTO chataovivo (dataInicio, idCliente) VALUES(?, ?);`;
  const dataAtual = new Date();

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

    const hashedPassword = await bcrypt.hash(senha, 10);

    const [result] = await db.query(sqlCliente, [nome, cpf, email, telefone, rua, estado, cidade, cep, numero, bairro]);
    const id = result.insertId;
    await db.query(sqlUsuario, [Usuario, email, hashedPassword]);
    await db.query(sqlChat, [dataAtual, id]);

    return res.json("Cadastrado");
  } catch (error) {
    console.error("Erro ao registrar o cliente:", error);
    return res.status(500).json("Error");
  }
});

//Cadastro de Cliente primeira etapa
app.post("/registrarprimeira", async (req, res) => {
  const { nome, email, senha } = req.body;
  const Usuario = "Clien";
  const sqlClienteS = `SELECT * FROM cliente WHERE email = ?;`;
  const sqlFuncionarioS = `SELECT * FROM funcionario WHERE email = ?;`;
  const sqlCliente = `INSERT INTO cliente(nome, cpfClien, email, telefone, rua, estado, cidade, cep, numero, bairro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  const sqlUsuario = `INSERT INTO usuario(nivelUser, email, senha) VALUES(?, ?, ?);`;
  const sqlChat = `INSERT INTO chataovivo (dataInicio, idCliente) VALUES(?, ?);`;
  const dataAtual = new Date();

  try {
    const [funcionarioResult] = await db.query(sqlFuncionarioS, [email]);
    if (funcionarioResult.length > 0) {
      if (funcionarioResult[0].email === email) return res.json("Email");
    }

    const [clienteResult] = await db.query(sqlClienteS, [email]);
    if (clienteResult.length > 0) {
      if (clienteResult[0].email === email) return res.json("Email");
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const [result] = await db.query(sqlCliente, [nome, "", email, "", "", "", "", "", "", ""]);
    const id = result.insertId;
    await db.query(sqlUsuario, [Usuario, email, hashedPassword]);
    await db.query(sqlChat, [dataAtual, id]);

    return res.json("Cadastrado");
  } catch (error) {
    console.error("Erro ao registrar o cliente:", error);
    return res.status(500).json("Error");
  }
});

// Cadastro de Funcionário
app.post("/registrarfunc", async (req, res) => {
  const { nome, email, senha, telefone, cpf, descricao } = req.body;
  const Usuario = "Func";
  const sqlFuncionarioS = `SELECT * FROM funcionario WHERE email = ? OR cpffunc = ? OR telefone = ?;`;
  const sqlClienteS = `SELECT * FROM cliente WHERE email = ? OR cpfclien = ? OR telefone = ?;`;
  const sqlFuncionario = `INSERT INTO funcionario(nome, cpffunc, email, telefone, descricao) VALUES(?, ?, ?, ?, ?);`;
  const sqlUsuario = `INSERT INTO usuario(nivelUser, email, senha) VALUES(?, ?, ?);`;

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

    const hashedPassword = await bcrypt.hash(senha, 10);

    await db.query(sqlFuncionario, [nome, cpf, email, telefone, descricao]);
    await db.query(sqlUsuario, [Usuario, email, hashedPassword]);

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
  const hora = dataAtual.getHours();
  const minutos = dataAtual.getMinutes();
  const segundos = dataAtual.getSeconds();
  const { solicitacao, valor, dataAgendada, descricao, servico, emailf, emailc, status } = req.body;
  console.log(solicitacao, valor, dataAgendada, descricao, servico, emailf, emailc, status);
  const sqlsAgendamento = "INSERT INTO agendamentodeservico(valor, solicitacao, dataAgendada, descricao, status, idServico, idFuncionario, idCliente) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
  const sqlPesquisaClien = "SELECT * FROM cliente WHERE email = ?";
  const sqlPesquisaFunc = "SELECT * FROM funcionario WHERE email = ?";
  const sqlUpdateServico = `SELECT * FROM servico WHERE servico = ?;`;

  try {
    const [clienteResults] = await db.query(sqlPesquisaClien, [emailc]);
    if (clienteResults.length <= 0) {
      return res.json("Cliente não encontrado.");
    }
    const idCliente = clienteResults[0].idCliente;

    const [funcionarioResults] = await db.query(sqlPesquisaFunc, [emailf]);
    if (funcionarioResults.length <= 0) {
      return res.json("Funcionário não encontrado.");
    }
    const idFuncionario = funcionarioResults[0].idFuncionario;

    const [result] = await db.query(sqlUpdateServico, [servico]);
    const idServico = result[0].idServico;

    await db.query(sqlsAgendamento, [
      valor,
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

//Cadastro Cortina
app.post('/registrarcortina', upload2.single("image"), async (req, res) => {
  const { nome, descricao, modelo, material } = req.body;
  const image = req.file;
  console.log(nome, descricao, modelo, material, image)
  if (!req.file) {
    return res.json({ error: 'Imagem é obrigatória.' });
  }
  const sql = `INSERT INTO cortina (nome, descricao, imagem, modelo, material) VALUES (?, ?, ?, ?, ?);`;
  try {
    await db.query(sql, [nome, descricao, image.filename, modelo, material]);
    return res.json('Cadastrado');
  } catch (error) {
    console.error('Erro ao registrar a cortina:', error);
    return res.json({ error: 'Erro ao registrar a cortina.' });
  }
});
//

//Cadastro Serviço
app.post('/registrarservico', async (req, res) => {
  const { descricao, servico } = req.body;
  const upperServico = servico.toUpperCase();

  const sqlSelect = "SELECT * FROM servico WHERE servico = ?";
  const sqlUpdate = `
    UPDATE servico SET alternar = ? WHERE idServico = ?`;
  const sqlServico = `INSERT INTO servico (descricao, servico, alternar) VALUES (?, ?, ?);`;

  try {
    const [result] = await db.query(sqlSelect, [upperServico]);

    if (result.length === 0) {
      await db.query(sqlServico, [descricao, upperServico, "A"]);
      return res.status(200).json('Cadastrado');
    }

    const id = result[0].idServico;
    await db.query(sqlUpdate, ["A", id]);
    res.status(200).json('Cadastrado');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao enviar serviço' });
  }
});

//Tabela Agendamento 
app.post("/tabelaagendamentos", async (req, res) => {
  const sql = `SELECT a.idAgendamento, a.idServico, a.solicitacao, a.descricao, a.dataAgendada,
   a.status, a.valor, c.email 'emailc', f.email 'emailf', s.alternar, s.servico FROM agendamentodeservico a LEFT JOIN cliente c ON a.idCliente = 
  c.idCliente LEFT JOIN funcionario f ON a.idFuncionario = f.idFuncionario LEFT JOIN servico s ON s.idServico = a.idServico;`;
  try {
    const [result] = await db.query(sql);
    return res.json(result);
  } catch (erro) {
    return res.json("error");
  }
});
//

//Tabelas Usuario
app.get("/tabelausuario", async (req, res) => {
  const sql = `SELECT f.idFuncionario, c.idCliente, u.idUsuario, c.nome 'nomec', c.email 'emailc', c.cpfClien, c.telefone 'telefonec', c.rua, c.bairro, c.cidade,
   c.cep, c.estado, c.numero, c.imagem, f.nome 'nomef', f.descricao, f.cpfFunc, f.telefone 'telefonef', f.email 'emailf', u.nivelUser, u.senha FROM usuario u LEFT JOIN
    funcionario f on f.email = u.email LEFT JOIN cliente c ON c.email = u.email;`;
  try {
    const [result] = await db.query(sql);
    return res.json(result);
  } catch (error) {
    console.error("Erro ao buscar usuario:", error);
    return res.status(500).json({ message: "Erro ao buscar usuario." });
  }
});
//

//Tabelas Cortina
app.post("/tabelacortinas", async (req, res) => {
  const sql = `SELECT * FROM cortina;`;
  try {
    const [result] = await db.query(sql);
    return res.json(result);
  } catch (error) {
    console.error("Erro ao buscar cortinas:", error);
    return res.json("Erro");
  }
});
//

//Tabelas Serviço
app.post("/tabelaservico", async (req, res) => {
  const sql = `SELECT * FROM servico;`;
  try {
    const [result] = await db.query(sql);
    return res.json(result);
  } catch (error) {
    console.error("Erro ao buscar serviço:", error);
    return res.json("Erro");
  }
});

//Deletar Mensagem
app.delete("/deletemessagem/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const sql = "DELETE FROM mensagem WHERE id = ?";
  try {
    await db.query(sql, [id]);

    return res.json("Deletado");
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return res.status(500).json({ message: "Erro ao deletar.", error });
  }
});
//

//Deletar Conta
app.post("/deleteconta", async (req, res) => {
  const { id, idUsuario, nivel, senha, email } = req.body;
  console.log(id, idUsuario, nivel, senha, email);

  const sqlSelect = `
    SELECT 
      u.senha FROM 
      usuario u 
    LEFT JOIN 
      cliente c ON u.email = c.email 
    LEFT JOIN 
      funcionario f ON u.email = f.email 
    WHERE 
      u.email = ?;
  `;
  const sqlUsuario = "DELETE FROM usuario WHERE idUsuario = ?";
  const sqlCliente = "DELETE FROM cliente WHERE idCliente = ?";
  const sqlFuncionario = "DELETE FROM funcionario WHERE idFuncionario = ?";
  const sqlMens = "DELETE FROM mensagem WHERE idMensagem = ?;";
  const sqlChat = "DELETE FROM chataovivo WHERE idCliente = ?;";
  const sqlChatSelect = "SELECT * FROM chataovivo WHERE idCliente = ?;";
  try {
    const [result] = await db.query(sqlSelect, [email]);

    if (result.length === 0) {
      return res.json("Credenciais Inválidas");
    }

    if (nivel === "Clien") {
      const isPasswordMatch = await bcrypt.compare(senha, result[0].senha);
      if (!isPasswordMatch) {
        return res.json("Credenciais Inválidas");
      }

      const [result] = await db.query(sqlChatSelect, [id]);
      const idChat = result[0].idChat;

      await db.query(sqlMens, [idChat]);
      await db.query(sqlChat, [id]);
      await db.query(sqlCliente, [id]);
      await db.query(sqlUsuario, [idUsuario]);
      return res.json("Deletado");
    } else if (nivel === "Func") {
      const isPasswordMatch = await bcrypt.compare(senha, result[0].senha);
      if (!isPasswordMatch) {
        return res.json("Credenciais Inválidas");
      }

      await db.query(sqlUsuario, [idUsuario]);
      await db.query(sqlFuncionario, [id]);
      return res.json("Deletado");
    } else {
      return res.json("Nível de usuário inválido");
    }
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return res.status(500).json({ message: "Erro ao deletar.", error });
  }
});
//

//Delete Cliente
app.post("/delete/:id/:idusuario", async (req, res) => {
  const { id, idusuario } = req.params;
  const { email, senha } = req.body;

  const sqlUsuarioValidar = "SELECT * FROM cliente WHERE idCliente = ? AND email = ?;";
  const sqlChatSelect = "SELECT * FROM chataovivo WHERE idCliente = ?;";
  const sqlUsuario = "DELETE FROM usuario WHERE idUsuario = ?;";
  const sqlChat = "DELETE FROM chataovivo WHERE idCliente = ?;";
  const sqlCliente = "DELETE FROM cliente WHERE idCliente = ?;";
  const sqlMens = "DELETE FROM mensagem WHERE idMensagem = ?;";

  if (senha !== "12345678") {
    return res.json("Credenciais inválidas");
  }

  const connection = await db.getConnection();
  try {
    // Validação inicial
    const [resultUsuario] = await connection.query(sqlUsuarioValidar, [id, email]);
    if (resultUsuario.length === 0) {
      return res.json("Credenciais inválidas");
    }

    // Obter idChat
    const [result] = await connection.query(sqlChatSelect, [id]);
    const idChat = result[0].idChat;

    // Iniciar transação
    await connection.beginTransaction();
    await connection.query(sqlMens, [idChat]);
    await connection.query(sqlChat, [id]);
    await connection.query(sqlCliente, [id]);
    await connection.query(sqlUsuario, [idusuario]);
    await connection.commit();

    return res.json("Deletado com sucesso.");
  } catch (error) {
    await connection.rollback();
    console.error("Erro ao deletar cliente:", error);
    return res.status(500).json("Erro ao deletar cliente");
  } finally {
    connection.release();
  }
});
//

//Delete Agendamento
app.post("/deleteagendamento/:id", async (req, res) => {
  const { id } = req.params;
  const { email, senha } = req.body;
  const sqlUsuarioValidar = "SELECT * FROM cliente c LEFT JOIN agendamentodeservico a ON c.idCliente = a.idCliente WHERE c.email = ? AND a.idAgendamento = ?;";
  const sqlDeleteAgendamento = "DELETE FROM agendamentodeservico WHERE idAgendamento = ?;";
  if (senha !== "12345678") {
    return res.json("Credenciais inválidas");
  }
  try {
    const [resultUsuario] = await db.query(sqlUsuarioValidar, [email, id]);
    if (resultUsuario.length <= 0) {
      return res.json("Credenciais inválidas");
    }
    await db.query(sqlDeleteAgendamento, [id]);
    return res.json("Deletado com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar Agendamento:", error);
    return res.status(500).json({ message: "Erro ao deletar funcionário.", error });
  }
});
//

//Delete Funcionario
app.post("/deletefuncionario/:id/:idusuario", async (req, res) => {
  const { id, idusuario } = req.params;
  const { email, senha } = req.body;
  const sqlUsuarioValidar = "SELECT * FROM funcionario WHERE idFuncionario = ? AND email = ?;";
  const sqlDeleteUsuario = "DELETE FROM usuario WHERE idUsuario = ?;";
  const sqlDeleteFuncionario = "DELETE FROM funcionario WHERE idFuncionario = ?;";
  try {
    if (senha !== "12345678") {
      return res.json("Credenciais inválidas");
    }
    const [resultUsuario] = await db.query(sqlUsuarioValidar, [id, email]);
    if (resultUsuario.length === 0) {
      return res.json("Credenciais inválidas");
    }
    await db.query(sqlDeleteFuncionario, [id]);
    await db.query(sqlDeleteUsuario, [idusuario]);
    return res.json("Deletado com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar funcionário:", error);
    return res.status(500).json({ message: "Erro ao deletar funcionário.", error });
  }
});
//

//Delete Cortina
app.delete("/deletecortina/:id", async (req, res) => {
  const imagemdapasta = path.join(__dirname, './upload/img');
  const validExtensions = ['.jpg', '.jpeg', '.png'];
  const { id } = req.params;

  const sqlSelectImage = "SELECT imagem FROM cortina WHERE idCortina = ?;";
  const sqlDelete = "DELETE FROM cortina WHERE idCortina = ?;";

  try {
    const [rows] = await db.query(sqlSelectImage, [id]);
    const imageFile = rows.length > 0 ? rows[0].imagem : null;

    await db.query(sqlDelete, [id]);

    const fileExtension = path.extname(imageFile).toLowerCase();
    if (validExtensions.includes(fileExtension)) {
      const imagePath = path.join(imagemdapasta, imageFile);

      try {
        await fs.promises.unlink(imagePath);
      } catch {
        return res.json("Cortina deletada, mas houve um erro ao excluir a imagem.");
      }
    }
    return res.json("Cortina e imagem deletados com sucesso");
  } catch {
    return res.json("Erro ao deletar Cortina");
  }
});
//

//Delete Serviço
app.post("/deleteservico/:id", async (req, res) => {
  const { id } = req.params;
  const { servico, senha } = req.body;
  console.log(servico, senha, id);
  const servicocase = servico.toUpperCase();
  const sqlSelect = "SELECT * FROM servico WHERE idServico = ? AND servico = ?";
  const sqlUpdateServico = `UPDATE servico SET alternar = ?, descricao = ? WHERE idServico = ? AND servico = ?`;
  if (senha !== "12345678") {
    return res.json("Credenciais inválidas");
  }
  try {
    const [result] = await db.query(sqlSelect, [id, servicocase]);
    if (result.length <= 0) {
      return res.json("Credenciais inválidas");
    }

    await db.query(sqlUpdateServico, ["D", "", id, servicocase]);
    return res.json("Deletado com sucesso.");
  } catch (error) {
    console.error("Erro ao deletar serviço:", error);
    return res.status(500).json({ message: "Erro ao deletar serviço.", error });
  }
});
//

// Editar Cliente
app.put("/editar/:id", upload2.single("image"), async (req, res) => {
  const { id } = req.params;
  const image = req.file;
  const { nome, email, telefone, cpf, rua, estado, cidade, cep, numero, bairro, idUsuario } = req.body;
  const sqlUpdateCliente = `UPDATE cliente SET imagem = ?, nome = ?, email = ?, telefone = ?, cpfClien = ?, rua = ?, estado = ?, cidade = ?, cep = ?, numero = ?, bairro = ? WHERE idCliente = ?;`;
  const sqlUpdateUsuario = `UPDATE usuario SET email = ? WHERE idUsuario = ?;`;
  const sqlCheckDuplicatesClien = `SELECT * FROM cliente WHERE (email = ? OR cpfClien = ? OR telefone = ?) AND idCliente != ?;`;
  const sqlCheckDuplicatesFunc = `SELECT * FROM funcionario WHERE (email = ? OR cpfFunc = ? OR telefone = ?);`;

  try {
    const [result] = await db.query(sqlCheckDuplicatesClien, [email, cpf, telefone, id]);
    const [resultFunc] = await db.query(sqlCheckDuplicatesFunc, [email, cpf, telefone]);

    if (result.length > 0 || resultFunc.length > 0) {
      const existingUser = result.length > 0 ? result[0] : null;
      const existingUserFunc = resultFunc.length > 0 ? resultFunc[0] : null;

      if (existingUser && existingUser.email === email || existingUserFunc && existingUserFunc.email === email) return res.json("Email");
      if (existingUser && existingUser.cpfClien === cpf || existingUserFunc && existingUserFunc.cpfFunc === cpf) return res.json("CPF");
      if (existingUser && existingUser.telefone === telefone || existingUserFunc && existingUserFunc.telefone === telefone) return res.json("Telefone");
    }

    await db.query(sqlUpdateCliente, [image ? image.filename : null, nome, email, telefone, cpf, rua, estado, cidade, cep, numero, bairro, id]);
    await db.query(sqlUpdateUsuario, [email, idUsuario]);

    return res.json("Atualizado");

  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return res.status(500).json({ message: "Erro ao atualizar cliente.", error });
  }
});

//Editar Usuario
app.put("/editarusuario/:id", async (req, res) => {
  const { id } = req.params; // ID do cliente ou funcionário
  const { nome, telefone, email, idUsuario, nivelUser } = req.body;

  // Queries SQL
  const sqlUpdateCliente = `UPDATE cliente SET nome = ?, telefone = ?, email = ? WHERE idCliente = ?;`;
  const sqlUpdateFuncionario = `UPDATE funcionario SET nome = ?, telefone = ?, email = ? WHERE idFuncionario = ?;`;
  const sqlUpdateUsuario = `UPDATE usuario SET email = ? WHERE idUsuario = ?;`;

  const sqlCheckDuplicates = `
    SELECT idCliente AS id, email, telefone, 'cliente' AS tipo
    FROM cliente
    WHERE (email = ? OR telefone = ?) AND idCliente != ?
    UNION
    SELECT idFuncionario AS id, email, telefone, 'funcionario' AS tipo
    FROM funcionario
    WHERE (email = ? OR telefone = ?) AND idFuncionario != ?;
  `;

  try {
    // Validação inicial dos dados
    if (!nome || !telefone || !email || !idUsuario || !nivelUser) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // Verifica duplicidade de email ou telefone
    const [duplicates] = await db.query(sqlCheckDuplicates, [
      email, telefone, id, // para cliente
      email, telefone, id  // para funcionário
    ]);

    if (duplicates.length > 0) {
      const existingUser = duplicates[0];

      if (existingUser.email === email) {
        return res.json("Email");
      }
      if (existingUser.telefone === telefone) {
        return res.json("Telefone");
      }
    }

    // Atualiza a tabela correspondente com base no nível do usuário
    if (nivelUser === "Clien") {
      await db.query(sqlUpdateCliente, [nome, telefone, email, id]);
    } else if (nivelUser === "Func") {
      await db.query(sqlUpdateFuncionario, [nome, telefone, email, id]);
    } else {
      return res.status(400).json({ message: "Nível de usuário inválido." });
    }

    // Atualiza a tabela de usuário
    await db.query(sqlUpdateUsuario, [email, idUsuario]);

    return res.json("Atualizado");
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ message: "Erro ao atualizar usuário.", error });
  }
})
//

// Editar Funcionário
app.put("/editarfuncionario/:id", upload2.single("image"), async (req, res) => {
  const { id } = req.params;
  const image = req.file;
  const { nome, email, telefone, cpf, descricao, idUsuario } = req.body;
  const sqlUpdateFuncionario = `UPDATE funcionario SET nome = ?, email = ?, telefone = ?, imagem = ?, cpfFunc = ?, descricao = ? WHERE idFuncionario = ?`;
  const sqlUpdateUsuario = `UPDATE usuario SET email = ? WHERE idUsuario = ?;`;
  const sqlCheckDuplicatesClien = `SELECT * FROM cliente WHERE (email = ? OR cpfClien = ? OR telefone = ?)`;
  const sqlCheckDuplicatesFunc = `SELECT * FROM funcionario WHERE (email = ? OR cpfFunc = ? OR telefone = ?) AND idFuncionario != ?;`;
  try {
    const [result] = await db.query(sqlCheckDuplicatesClien, [email, cpf, telefone]);
    const [resultFunc] = await db.query(sqlCheckDuplicatesFunc, [email, cpf, telefone, id]);

    if (result.length > 0 || resultFunc.length > 0) {
      const existingUser = result.length > 0 ? result[0] : null;
      const existingUserFunc = resultFunc.length > 0 ? resultFunc[0] : null;

      if (existingUser && existingUser.email === email || existingUserFunc && existingUserFunc.email === email) return res.json("Email");
      if (existingUser && existingUser.cpfClien === cpf || existingUserFunc && existingUserFunc.cpfFunc === cpf) return res.json("CPF");
      if (existingUser && existingUser.telefone === telefone || existingUserFunc && existingUserFunc.telefone === telefone) return res.json("Telefone");
    }

    await db.query(sqlUpdateFuncionario, [nome, email, telefone, image ? image.filename : null, cpf, descricao, id]);
    await db.query(sqlUpdateUsuario, [email, idUsuario]);

    return res.json("Atualizado");
  } catch (error) {
    console.error("Erro ao atualizar funcionário:", error);
    return res.status(500).json({ message: "Erro ao atualizar funcionário.", error });
  }
});
//

//Editar Agendamento
app.put("/editaragendamento/:id", async (req, res) => {
  const { id } = req.params;
  const { dataAgendada, status, servico, valor, descricao } = req.body;
  const sqlUpdateAgendamento = `
    UPDATE agendamentodeservico SET dataAgendada = ?, status = ?, descricao = ?, valor = ?, idServico = ? WHERE idAgendamento = ?`;
  const sqlUpdateServico = `SELECT * FROM servico WHERE servico = ?;`;

  try {
    const [result] = await db.query(sqlUpdateServico, [servico]);
    const idServico = result[0].idServico;
    await db.query(sqlUpdateAgendamento, [dataAgendada, status, descricao, valor, idServico, id]);
    return res.json("Atualizado");
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return res.status(500).json({ message: "Erro ao atualizar agendamento.", error });
  }
});

//Editar Serviço
app.put("/editarservico/:id", async (req, res) => {
  const { id } = req.params;
  const { servico, descricao } = req.body;

  const sqlUpdateServico = `
    UPDATE servico SET descricao = ?, servico = ? WHERE idServico = ?`;

  try {
    await db.query(sqlUpdateServico, [descricao, servico, id]);
    return res.json("Atualizado");
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    return res.status(500).json({ message: "Erro ao atualizar serviço.", error });
  }
});
//

//Editar Cortina
app.put("/editarcortina/:id", upload2.single("image"), async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, modelo, material } = req.body;
  const imagemdapasta = path.join(__dirname, './upload/img');
  const sqlSelectImage = "SELECT imagem FROM cortina WHERE idCortina = ?;";
  const sqlUpdateImage = "UPDATE cortina SET imagem = ?, nome = ?, descricao = ?, modelo = ?, material = ? WHERE idCortina = ?;";

  try {
    const [rows] = await db.query(sqlSelectImage, [id]);

    if (rows.length === 0) {
      return res.json({ message: "Cortina não encontrada." });
    }
    const oldImageFile = rows[0].imagem;

    if (oldImageFile) {
      const oldImagePath = path.join(imagemdapasta, oldImageFile);
      if (fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Erro ao excluir a imagem antiga");
          } else {
            console.log('Imagem antiga excluída com sucesso!');
          }
        });
      } else {
        console.log("A imagem antiga não foi encontrada");
      }
    }
    const newImageFile = req.file.filename;
    await db.query(sqlUpdateImage, [newImageFile, nome, descricao, modelo, material, id]);

    return res.json("Atualizado");
  } catch (error) {
    console.error("Erro ao editar a imagem da cortina");
    return res.json("Erro ao editar a imagem da cortina");
  }
});

// Produto Solo
app.get('/cortina/:idCortina', async (req, res) => {
  const { idCortina } = req.params;
  const sql = `SELECT * FROM cortina WHERE idCortina = ?;`;
  try {
    const [result] = await db.query(sql, [idCortina]);
    return res.json(result);
  } catch (error) {
    console.error("Erro ao buscar cortinas:", error);
    return res.json("Erro");
  }
});
//

// Dados cliente
app.post('/userprofile', async (req, res) => {
  const { id, niveluser } = req.body;
  let sql;
  if (niveluser === "Clien") {
    sql = `SELECT ct.idChat, c.idCliente "id", c.nome, c.cpfClien "cpf", c.telefone, c.rua, c.bairro, c.cidade, c.cep, c.estado, 
           c.numero, c.imagem, c.email, u.idUsuario FROM cliente c LEFT JOIN usuario u ON c.email = u.email 
           LEFT JOIN chataovivo ct ON ct.idCliente = c.idCliente WHERE c.idCliente = ?;`;
  } else if (niveluser === "Func") {
    sql = `SELECT f.idFuncionario "id", f.nome, f.cpfFunc "cpf", f.descricao, f.telefone, f.imagem, f.email, u.idUsuario
           FROM funcionario f LEFT JOIN usuario u ON f.email = u.email LEFT JOIN cliente c ON c.email = u.email WHERE f.idFuncionario = ?;`;
  }

  try {
    const [result] = await db.query(sql, [id]);
    return res.json(result);
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return res.status(500).json("Erro ao buscar dados do usuário.");
  }
});
//

// Rota para buscar todas as mensagens
app.get("/mensagens/:id", async (req, res) => {
  const id = req.params;
  const sql = `SELECT m.idMensagem, m.conteudo, m.dataHora, m.id, m.imagem, m.audio, m.visualizada,
   m.remetente, cl.nome FROM chataovivo c LEFT JOIN mensagem m ON c.idChat = m.idMensagem LEFT JOIN cliente cl ON cl.idCliente = c.idCliente WHERE c.idCliente = ?;`;
  try {
    const [result] = await db.query(sql, [id.id]);
    if (result[0].conteudo == null && result[0].audio == null && result[0].imagem == null) {
      return res.json(["Vazios"]);
    }
    return res.json(result);
  } catch {
    res.json("Erro ao buscar mensagens");
  }
});

// Rota para enviar uma nova mensagem com validação
app.post("/enviarmensagem", upload.fields([{ name: "image", maxCount: 1 },
{ name: "audio", maxCount: 1 },
]),
  async (req, res) => {
    const { text, visualizada, idChat } = req.body;
    const image = req.files?.image?.[0];
    const audio = req.files?.audio?.[0];
    console.log("Tudo: " + text, visualizada, idChat)
    console.log("Imagem: " + image)
    console.log("Audio: " + audio)
    const dataAtual = new Date();
    const sqlMensagem = `
              INSERT INTO mensagem 
              (remetente, dataHora, conteudo, imagem, audio, visualizada, idmensagem) 
              VALUES (?, ?, ?, ?, ?, ?, ?);
          `;

    try {
      await db.query(sqlMensagem, [
        "C",
        dataAtual,
        text || "",
        image ? image.filename : null,
        audio ? audio.filename : null,
        visualizada || "NL",
        idChat,
      ]);

      res.status(200).json({ message: "Mensagem cadastrada com sucesso!" });
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      res.status(500).json({ error: "Erro ao enviar mensagem." });
    }
  }
);
//

// Rota para buscar todas as mensagen para o FUCIONARIO
app.get("/mensagensfunc/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (id > 0) {
    const sql = `SELECT m.id, m.remetente, u.nivelUser, c.idCliente, m.idMensagem, m.dataHora, m.conteudo, m.imagem, m.audio, m.visualizada,
   cl.nome FROM cliente cl LEFT JOIN chataovivo c ON cl.idCliente = c.idCliente 
   LEFT JOIN mensagem m ON c.idChat = m.idMensagem LEFT JOIN usuario u ON u.nivelUser = c.idCliente WHERE m.idMensagem = ?;`;
    try {
      const [result] = await db.query(sql, [id]);
    
      return res.json(result);
    } catch {
      res.json("Erro ao buscar mensagens");
    }
  } else {
    return res.json("Nenhuma mensagem enviada");
  }
});

// Rota para enviar uma nova mensagem com validação FUNCIONARIO
app.post("/enviarmensagemfunc", upload.fields([{ name: "image", maxCount: 1 },
{ name: "audio", maxCount: 1 },
]),
  async (req, res) => {
    const { text, visualizada, idChat } = req.body;
    const image = req.files?.image?.[0];
    const audio = req.files?.audio?.[0];
    const dataAtual = new Date();

    const sqlMensagem = `
          INSERT INTO mensagem 
          (remetente, dataHora, conteudo, imagem, audio, visualizada, idmensagem) 
          VALUES (?, ?, ?, ?, ?, ?, ?);
      `;

    try {
      await db.query(sqlMensagem, [
        "F",
        dataAtual,
        text || "",
        image ? image.filename : null,
        audio ? audio.filename : null,
        visualizada || "NL",
        idChat,
      ]);

      res.status(200).json({ message: "Mensagem cadastrada com sucesso!" });
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      res.status(500).json({ error: "Erro ao enviar mensagem." });
    }
  }
);
//

// Conversas
app.get("/conversas", async (req, res) => {
  const sql = `SELECT c.idChat, c.idCliente, cl.nome, cl.imagem FROM chataovivo c LEFT JOIN cliente cl ON c.idCliente = cl.idCliente;`;
  try {
    const [result] = await db.query(sql);
    return res.json(result);
  } catch {
    res.json("Erro ao buscar mensagens");
  }
});
//

//Editar Mensagem
app.post("/editarmensagem", async (req, res) => {
  const { conteudo, id } = req.body;
  console.log(conteudo, id);
  const sqlUpdateServico = `
    UPDATE mensagem SET conteudo = ? WHERE id = ?`;

  try {
    await db.query(sqlUpdateServico, [conteudo.mensagem, id]);
    return res.json("Atualizado");
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    return res.status(500).json({ message: "Erro ao atualizar serviço.", error });
  }
});
//


app.listen(3001, () => {
  console.log("Servidor rodando...");
})