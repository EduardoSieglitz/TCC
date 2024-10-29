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
    const decoded = jwt.verify(token, 'secret_key');
    const email = decoded.email;

    const sqlVerifyUser = `SELECT * FROM usuario WHERE email = ?`;
    const [userResult] = await db.query(sqlVerifyUser, [email]);

    if (userResult.length === 0) {
      return res.json('Usuário não encontrado');
    }
    const hashedPassword = bcrypt.hashSync(newPassword);

    const sqlUpdatePassword = `UPDATE usuario SET senha = ? WHERE email = ?`;
    const sqlUpdatePasswordCliente = `UPDATE cliente SET senha = ? WHERE email = ?`;
    await db.query(sqlUpdatePassword, [newPassword, email]);
    await db.query(sqlUpdatePasswordCliente, [newPassword, email]);

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

//Cadastro de Cliente
app.post("/registrar", async (req, res) => {
  const { nome, email, senha, telefone, cpf, rua, estado, cidade, cep, numero, bairro } = req.body;
  const Usuario = "Clien";
  const sqlClienteS = `SELECT * FROM cliente WHERE email = ? OR cpfClien = ? OR telefone = ?;`;
  const sqlFuncionarioS = `SELECT * FROM funcionario WHERE email = ? OR cpfFunc = ? OR telefone = ?;`;
  const sqlCliente = `INSERT INTO cliente(nome, cpfClien, senha, email, telefone, rua, estado, cidade, cep, numero, bairro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
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
    const [result] = await db.query(sqlCliente, [nome, cpf, senha, email, telefone, rua, estado, cidade, cep, numero, bairro]);
    const id = result.insertId;
    await db.query(sqlUsuario, [Usuario, email, senha]);
    await db.query(sqlChat, [dataAtual, id]);
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
  const hora = dataAtual.getHours();
  const minutos = dataAtual.getMinutes();
  const segundos = dataAtual.getSeconds();
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

//Cadastro Cortina
app.post('/registrarcortina', upload.single("image"), async (req, res) => {
  const { nome, descricao, tipo, material } = req.body;
  const image = req.file;

  if (!req.file) {
    return res.json({ error: 'Imagem é obrigatória.' });
  }
  const sql = `INSERT INTO cortina (nome, descricao, imagem, tipo, material) VALUES (?, ?, ?, ?, ?);`;
  try {
    await db.query(sql, [nome, descricao, image.filename, tipo, material]);
    return res.json('Cadastrado');
  } catch (error) {
    console.error('Erro ao registrar a cortina:', error);
    return res.json({ error: 'Erro ao registrar a cortina.' });
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

//Tabelas Funcionario
app.post("/tabelafuncionario", async (req, res) => {
  const sql = `SELECT f.idFuncionario, u.idUsuario, f.nome, f.descricao, f.cpfFunc, f.telefone,
   f.email, f.senha FROM funcionario f LEFT JOIN usuario u on f.email = u.email;`;
  try {
    const [result] = await db.query(sql);
    return res.json(result);
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
    return res.status(500).json({ message: "Erro ao buscar funcionários." });
  }
});
//

//Tabelas Cliente
app.post("/tabelacliente", async (req, res) => {
  const sql = `SELECT c.idCliente, u.idUsuario, c.nome, c.cpfClien, c.telefone, c.email,
   c.senha, c.rua, c.estado, c.cidade, c.cep, c.numero, c.bairro FROM cliente c LEFT JOIN usuario u on c.email = u.email;`;
  try {
    const [result] = await db.query(sql);
    return res.json(result);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return res.status(500).json({ message: "Erro ao buscar clientes." });
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

//Delete Agendamento
app.delete("/deleteagendamento/:id", async (req, res) => {
  const { id } = req.params;
  const sqlDeleteAgendamento = "DELETE FROM agendamentodeservico WHERE idAgendamento = ?;";
  const sqlDeleteServico = "DELETE FROM servico WHERE idServico = ?;";
  try {
    await db.query(sqlDeleteAgendamento, [id]);
    await db.query(sqlDeleteServico, [id]);
    return res.json({ message: "Agendamento deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar Agendamento:", error);
    return res.status(500).json({ message: "Erro ao deletar funcionário.", error });
  }
});

//

//Delete Cliente
app.delete("/delete/:id/:idusuario", async (req, res) => {
  const { id, idusuario } = req.params;
  const sqlUsuario = "DELETE FROM usuario WHERE idUsuario = ?;";
  const sqlCliente = "DELETE FROM cliente WHERE idCliente = ?;";
  console.log(id, idusuario)
  try {
    await db.query(sqlCliente, [id]);
    await db.query(sqlUsuario, [idusuario]);
    return res.json({ message: "Cliente deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    return res.status(500).json({ message: "Erro ao deletar cliente.", error });
  }
});
//

//Delete Funcionario
app.delete("/deletefunc/:id/:idusuario", async (req, res) => {
  const { id, idusuario } = req.params;
  const sqlDeleteUsuario = "DELETE FROM usuario WHERE idUsuario = ?;";
  const sqlDeleteFuncionario = "DELETE FROM funcionario WHERE idFuncionario = ?;";
  console.log(id, idusuario)
  try {
    await db.query(sqlDeleteFuncionario, [id]);
    await db.query(sqlDeleteUsuario, [idusuario]);
    return res.json({ message: "Funcionário deletado com sucesso." });
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

//Editar Cliente
app.put("/editar/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, telefone, cpf, rua, estado, cidade, cep, numero, bairro, idUsuario } = req.body;
  console.log(nome, email, senha, telefone, cpf, rua, estado, cidade, cep, numero, bairro, idUsuario)
  const sqlUpdateCliente = `UPDATE cliente SET nome = ?, email = ?, senha = ?, telefone = ?, cpfClien = ?, 
  rua = ?, estado = ?, cidade = ?, cep = ?, numero = ?, bairro = ? WHERE idCliente = ?;`;
  const sqlUpdateUsuario = `UPDATE usuario SET email = ?, senha = ? WHERE idUsuario = ?;`;
  const sqlCheckDuplicatesClien = `SELECT * FROM cliente WHERE (email = ? OR cpfClien = ? OR telefone = ?) AND idCliente != ?;`;
  const sqlCheckDuplicatesFunc = `SELECT * FROM funcionario WHERE (email = ? OR cpfFunc = ? OR telefone = ?);`;
  try {
    const [result] = await db.query(sqlCheckDuplicatesClien, [email, cpf, telefone, id]);
    const [resultFunc] = await db.query(sqlCheckDuplicatesFunc, [email, cpf, telefone]);

    if (result.length > 0 || resultFunc.length > 0) {
      const existingUser = result.length > 0 ? result[0] : null;
      const existingUserFunc = resultFunc.length > 0 ? resultFunc[0] : null;

      if (existingUser && existingUser.email === email || existingUserFunc && existingUserFunc.email === email) {
        return res.json("Email");
      }
      if (existingUser && existingUser.cpfClien === cpf || existingUserFunc && existingUserFunc.cpfFunc === cpf) {
        return res.json("CPF");
      }
      if (existingUser && existingUser.telefone === telefone || existingUserFunc && existingUserFunc.telefone === telefone) {
        return res.json("Telefone");
      }
    }

    await db.query(sqlUpdateCliente, [nome, email, senha, telefone, cpf, rua, estado, cidade, cep, numero, bairro, id]);
    await db.query(sqlUpdateUsuario, [email, senha, idUsuario]);
    return res.json("Atualizado");

  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return res.status(500).json({ message: "Erro ao atualizar cliente.", error });
  }
});
//

//Editar Funcionário
app.put("/editarfunc/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, telefone, cpf, descricao, idUsuario } = req.body;
  console.log(nome, email, senha, telefone, cpf, descricao, idUsuario);
  const sqlUpdateFuncionario = `UPDATE funcionario SET nome = ?, email = ?, senha = ?, telefone = ?, cpfFunc = ?, descricao = ? WHERE idFuncionario = ?`;
  const sqlUpdateUsuario = `UPDATE usuario SET email = ?, senha = ? WHERE idUsuario = ?;`;
  const sqlCheckDuplicatesClien = `SELECT * FROM cliente WHERE (email = ? OR cpfClien = ? OR telefone = ?)`;
  const sqlCheckDuplicatesFunc = `SELECT * FROM funcionario WHERE (email = ? OR cpfFunc = ? OR telefone = ?) AND idFuncionario != ?;;`;
  try {
    const [result] = await db.query(sqlCheckDuplicatesClien, [email, cpf, telefone]);
    const [resultFunc] = await db.query(sqlCheckDuplicatesFunc, [email, cpf, telefone, id]);

    if (result.length > 0 || resultFunc.length > 0) {
      const existingUser = result.length > 0 ? result[0] : null;
      const existingUserFunc = resultFunc.length > 0 ? resultFunc[0] : null;

      if (existingUser && existingUser.email === email || existingUserFunc && existingUserFunc.email === email) {
        return res.json("Email");
      }
      if (existingUser && existingUser.cpfClien === cpf || existingUserFunc && existingUserFunc.cpfFunc === cpf) {
        return res.json("CPF");
      }
      if (existingUser && existingUser.telefone === telefone || existingUserFunc && existingUserFunc.telefone === telefone) {
        return res.json("Telefone");
      }
    }

    await db.query(sqlUpdateFuncionario, [nome, email, senha, telefone, cpf, descricao, id]);
    await db.query(sqlUpdateUsuario, [email, senha, idUsuario]);

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
  const { dataAgendada, descricao, status, valor, servico } = req.body;
  console.log(dataAgendada, descricao, status, valor, servico)
  const sqlUpdateAgendamento = `
    UPDATE agendamentodeservico SET dataAgendada = ?, descricao = ?, status = ? WHERE idAgendamento = ?`;
  const sqlUpdateServico = `
    UPDATE servico SET valor = ?, servico = ? WHERE idServico = ?`;
  try {
    await db.query(sqlUpdateAgendamento, [dataAgendada, descricao, status, id]);
    await db.query(sqlUpdateServico, [valor, servico, id]);
    return res.json("Atualizado");
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return res.status(500).json({ message: "Erro ao atualizar agendamento.", error });
  }
});

//Editar Cortina
app.put("/editarcortina/:id", upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, tipo, material } = req.body;
  const imagemdapasta = path.join(__dirname, './upload/img');
  console.log(req.file);
  const sqlSelectImage = "SELECT imagem FROM cortina WHERE idCortina = ?;";
  const sqlUpdateImage = "UPDATE cortina SET imagem = ?, nome = ?, descricao = ?, tipo = ?, material = ? WHERE idCortina = ?;";

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
    await db.query(sqlUpdateImage, [newImageFile, nome, descricao, tipo, material, id]);

    return res.json("Atualizado");
  } catch (error) {
    console.error("Erro ao editar a imagem da cortina");
    return res.json("Erro ao editar a imagem da cortina");
  }
});

// Rota para buscar todas as mensagens
app.get("/mensagens", async (req, res) => {
  const sql = `SELECT m.remetente, u.nivelUser, c.idCliente, m.idMensagem, m.dataHora, m.conteudo, m.imagem, m.audio, m.visualizada,
   cl.nome FROM cliente cl LEFT JOIN chataovivo c ON cl.idCliente = c.idCliente 
   LEFT JOIN mensagem m ON c.idChat = m.idMensagem LEFT JOIN usuario u ON u.nivelUser = c.idCliente;`;
  try {
    const [result] = await db.query(sql);
    return res.json(result);
  } catch {
    res.json("Erro ao buscar mensagens");
  }
});

// Rota para enviar uma nova mensagem com validação
app.post('/enviarmensagem', async (req, res) => {
  const { conteudo, imagem, audio, visualizada, id } = req.body;
  const dataAtual = new Date();

  const sqlMensagem = `INSERT INTO mensagem (remetente, dataHora, conteudo, imagem, audio, visualizada, idmensagem) VALUES (?, ?, ?, ?, ?, ?, ?);`;
  const sqlChat = "SELECT * FROM chataovivo WHERE idCliente = ?;";
  try {
    const [result] = await db.query(sqlChat, [id]);
    const idChat = result[0].idChat;
    await db.query(sqlMensagem, ["C", dataAtual, conteudo, imagem, audio, visualizada, idChat]);
    res.status(200).json('Cadastrado');
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});
//

// Rota para buscar todas as mensagen para o FUCIONARIO
app.get("/mensagensfunc", async (req, res) => {
  const sql = `SELECT m.remetente, u.nivelUser, c.idCliente, m.idMensagem, m.dataHora, m.conteudo, m.imagem, m.audio, m.visualizada,
   cl.nome FROM cliente cl LEFT JOIN chataovivo c ON cl.idCliente = c.idCliente 
   LEFT JOIN mensagem m ON c.idChat = m.idMensagem LEFT JOIN usuario u ON u.nivelUser = c.idCliente;`;
  try {
    const [result] = await db.query(sql);
    return res.json(result);
  } catch {
    res.json("Erro ao buscar mensagens");
  }
});

// Rota para enviar uma nova mensagem com validação para o FUNCIONARIO
app.post('/enviarmensagemfunc', async (req, res) => {
  const { conteudo, imagem, audio, visualizada } = req.body;
  console.log(conteudo, imagem, audio, visualizada)
  const dataAtual = new Date();

  const sqlMensagem = `INSERT INTO mensagem (remetente, dataHora, conteudo, imagem, audio, visualizada, idmensagem) VALUES (?, ?, ?, ?, ?, ?, ?);`;
  try {
    await db.query(sqlMensagem, ["F", dataAtual, conteudo, imagem, audio, visualizada, 1]);
    res.status(200).json('Cadastrado');
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});
//

app.listen(3001, () => {
  console.log("Servidor rodando...");
})