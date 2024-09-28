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
  const { nome } = req.body,
    { email } = req.body,
    { senha } = req.body,
    { telefone } = req.body,
    { cpf } = req.body,
    { endereco } = req.body,
    Usuario = "Clien",
    sqlClienteS = "SELECT * FROM cliente WHERE cliente.email = ? || cliente.cpf = ? || cliente.telefone = ?;",
    sqlFuncionarioS = "SELECT * FROM funcionario WHERE funcionario.email = ? || funcionario.cpf = ? || funcionario.telefone = ?;",
    sqlCliente = "INSERT INTO cliente(nome, cpf, senha, email, telefone, endereco) VALUES(?, ?, ?, ?, ?, ?)",
    sqlUsuario = "INSERT INTO usuario(nivelUser, email, senha) VALUES(?, ?, ?)";
  db.query(sqlFuncionarioS, [email, cpf, telefone], (erro, result) => {
    try {
      if (result[0].email == email) {
        return res.json("Email");
      }
      if (result[0].cpf == cpf) {
        return res.json("CPF");
      }
      if (result[0].telefone == telefone) {
        return res.json("Telefone");
      }
    } catch {
      db.query(sqlClienteS, [email, cpf, telefone], (erro, result) => {
        try {
          if (result[0].email == email) {
            return res.json("Email");
          }
          if (result[0].cpf == cpf) {
            return res.json("CPF");
          }
          if (result[0].telefone == telefone) {
            return res.json("Telefone");
          }
        } catch {
          db.query(sqlCliente, [nome, cpf, senha, email, telefone, endereco], (erro, result) => {
            try {
              db.query(sqlUsuario, [Usuario, email, senha], (erro, result) => {
                return res.json("Cadastrado");
              });
            } catch {
              return res.json("Error");
            }
          });
        }
      })
    }
  });
})
//

//Cadastro Funcionario
app.post("/registrarfunc", async (req, res) => {
  const { nome } = req.body,
    { email } = req.body,
    { senha } = req.body,
    { telefone } = req.body,
    { cpf } = req.body,
    { descricao } = req.body,
    Usuario = "Func",
    sqlFuncionarioS = "SELECT * FROM funcionario WHERE funcionario.email = ? || funcionario.cpf = ? || funcionario.telefone = ?;",
    sqlCliente = "INSERT INTO funcionario(nome, cpf, senha, email, telefone, descricao) VALUES(?, ?, ?, ?, ?, ?)",
    sqlClienteS = "SELECT * FROM cliente WHERE cliente.email = ? || cliente.cpf = ? || cliente.telefone = ?;",
    sqlUsuario = "INSERT INTO usuario(nivelUser, email, senha) VALUES(?, ?, ?)";
  db.query(sqlFuncionarioS, [email, cpf, telefone], (erro, result) => {
    try {
      if (result[0].email == email) {
        return res.json("Email");
      }
      if (result[0].cpf == cpf) {
        return res.json("CPF");
      }
      if (result[0].telefone == telefone) {
        return res.json("Telefone");
      }
    } catch {
      db.query(sqlClienteS, [email, cpf, telefone], (erro, result) => {
        try {
          if (result[0].email == email) {
            return res.json("Email");
          }
          if (result[0].cpf == cpf) {
            return res.json("CPF");
          }
          if (result[0].telefone == telefone) {
            return res.json("Telefone");
          }
        } catch {
          db.query(sqlCliente, [nome, cpf, senha, email, telefone, descricao], (erro, result) => {
            db.query(sqlUsuario, [Usuario, email, senha], (erro, result) => {
              return res.json("Cadastrado");
            });
          });
        }
      });
    }
  });
})
//

//Login de Usuario
app.post("/login/auth", async (req, res) => {
  const { email } = req.body,
    { senha } = req.body,
    sqlFuncionario = "SELECT f.idFuncionario , f.email, f.senha, u.nivelUser FROM funcionario f LEFT JOIN usuario u ON f.email = u.email where f.email = ? and f.senha = ?",
    sqlCliente = "SELECT c.idCliente , c.email, c.senha, u.nivelUser FROM cliente c LEFT JOIN usuario u ON c.email = u.email where c.email = ? and c.senha = ?";
  db.query(sqlCliente, [email, senha], (erro, result) => {
    try {
      if (result[0].email == email && result[0].senha == senha) {
        return res.json({ token: true, dados: result });
      }
    } catch (erro) {
      db.query(sqlFuncionario, [email, senha], (erro, results) => {
        try {
          if (results[0].email == email && results[0].senha == senha) {
            return res.json({ token: true, dados: results });
          }
        } catch (error) {
          return res.json({ token: false, dados: [{ nivelUser: "error" }] });
        }
      });
    }
  })
});

//Tabelas Funcionario
app.post("/tabelafuncionario", async (req, res) => {
  const sql = "SELECT * FROM funcionario";
  db.query(sql, (erro, result) => {
    try {
      return res.json(result);
    } catch (erro) {
      return res.json("error");
    }
  })
});

//Tabelas Cliente
app.post("/tabelacliente", async (req, res) => {
  const sql = "SELECT * FROM cliente";
  db.query(sql, (erro, result) => {
    try {
      return res.json(result);
    } catch (erro) {
      return res.json("error");
    }
  })
});

//Delete Cliente
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const sqlUsuario = "DELETE FROM usuario WHERE idUsuario = ?;";
  const sqlCliente = "DELETE FROM cliente WHERE idCliente = ?;";
  try {
    db.query(sqlCliente, [id]);
    db.query(sqlUsuario, [id]);
    return res.json({ message: "Cliente deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar cliente.", error });
  }
});

//Editar Cliente
app.put("/editar/:id", async (req, res) => {
  console.log("Editar")
  const { id } = req.params;
  const { nome, email, senha, telefone, cpf, endereco } = req.body;

  const sqlUpdateCliente = "UPDATE cliente SET nome = ?, email = ?, senha = ?, telefone = ?, cpf = ?, endereco = ? WHERE idCliente = ?";
  const sqlUpdateUsuario = "UPDATE usuario SET email = ?, senha = ? WHERE email = (SELECT email FROM cliente WHERE idCliente = ?)";
  const sqlCheckDuplicates = "SELECT * FROM cliente WHERE (email = ? OR cpf = ? OR telefone = ?) AND idCliente != ?";

  try {
    const result = db.query(sqlCheckDuplicates, [email, cpf, telefone, id]);
    console.log(result)
    if (result.length > 0) {
      const existingUser = result[0];
      if (existingUser.email === email) return res.json("Email");
      if (existingUser.cpf === cpf) return res.json("CPF");
      if (existingUser.telefone === telefone) return res.json("Telefone");
    }
    db.query(sqlUpdateCliente, [nome, email, senha, telefone, cpf, endereco, id]);
    db.query(sqlUpdateUsuario, [email, senha, id]);

    return res.json("Cadastrado");
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar cliente.", error });
  }
});

//Delete Funcionario
app.delete("/deletefunc/:id", async (req, res) => {
  const { id } = req.params;
  const sqlUsuario = "DELETE FROM usuario WHERE idUsuario = ?;";
  const sqlCliente = "DELETE FROM funcionario WHERE idFuncionario = ?;";
  try {
    db.query(sqlCliente, [id]);
    db.query(sqlUsuario, [id]);
    return res.json({ message: "Funcionario deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar Funcionario.", error });
  }
});

//Editar Funcionario
app.put("/editarfunc/:id", async (req, res) => {
  console.log("Editar")
  const { id } = req.params;
  const { nome, email, senha, telefone, cpf, descricao } = req.body;

  const sqlUpdateFuncionario = "UPDATE funcionario SET nome = ?, email = ?, senha = ?, telefone = ?, cpf = ?, descricao = ? WHERE idFuncionario = ?";
  const sqlUpdateUsuario = "UPDATE usuario SET email = ?, senha = ? WHERE email = (SELECT email FROM cliente WHERE idFuncionario = ?)";
  const sqlCheckDuplicates = "SELECT * FROM funcionario WHERE (email = ? OR cpf = ? OR telefone = ?) AND idFuncionario != ?";

  try {
    const result = db.query(sqlCheckDuplicates, [email, cpf, telefone, id]);
    console.log(result)
    if (result.length > 0) {
      const existingUser = result[0];
      if (existingUser.email === email) return res.json("Email");
      if (existingUser.cpf === cpf) return res.json("CPF");
      if (existingUser.telefone === telefone) return res.json("Telefone");
    }
    db.query(sqlUpdateFuncionario, [nome, email, senha, telefone, cpf, descricao, id]);
    db.query(sqlUpdateUsuario, [email, senha, id]);

    return res.json("Cadastrado");
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar funcionario.", error });
  }
});



app.listen(3001, () => {
  console.log("Servidor rodando...");
})