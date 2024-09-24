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
    sqlUsuario = "INSERT INTO usuario(nivelUser, idCliente) VALUES(?, ?)";
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
            const idCliente = result.insertId;
            db.query(sqlUsuario, [Usuario, idCliente], (erro, result) => {
              return res.json("Cadastrado");
            });
          });
        }
      })
    }
  });
})
//

//Cadastro Funcionario
app.post("/registrarfunc", (req, res) => {
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
    sqlUsuario = "INSERT INTO usuario(nivelUser, idFuncionario) VALUES(?, ?)";
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
            console.log("Cadastrado Funcionario");
            const idFuncionario = result.insertId;
            db.query(sqlUsuario, [Usuario, idFuncionario], (erro, result) => {
              console.log("Castrado Usuario");
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
    sqlFuncionario = "SELECT f.idFuncionario , f.email, f.senha, u.nivelUser FROM funcionario f LEFT JOIN usuario u ON f.idFuncionario = u.nivelUser where f.email = ? and f.senha = ?",
    sqlCliente = "SELECT c.idCliente , c.email, c.senha, u.nivelUser FROM cliente c LEFT JOIN usuario u ON c.idCliente = u.idUsuario where c.email = ? and c.senha = ?";
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

app.listen(3001, () => {
  console.log("Servidor rodando...");
})