const { json } = require("body-parser"),
  express = require("express"),
  app = express(),
  db = require("./database/pool"),
  cors = require("cors"),
  tabelas = require("./tabelas/Tabelas");

app.use(cors());
app.use(json());

//Cadastro de Usuario
app.post("/registrar", (req, res) => {
  const { nome } = req.body,
    { email } = req.body,
    { senha } = req.body,
    { telefone } = req.body,
    { cpf } = req.body,
    { endereco } = req.body,
    Usuario = "Clien",
    sqlCliente = "INSERT INTO cliente(nome, cpf, senha, email, telefone, endereco) VALUES(?, ?, ?, ?, ?, ?)",
    sqlUsuario = "INSERT INTO usuario(nivelUser, idCliente) VALUES(?, ?)";
  db.query(sqlCliente, [nome, cpf, senha, email, telefone, endereco], (erro, result) => {
    console.log("Cadastrado Cliente");
    const idCliente = result.insertId;
    db.query(sqlUsuario, [Usuario, idCliente], (erro, result) => {
      console.log("Cdastrado Usuario");
      return res.json({ Cadastro: "Cadastrado" });
    });
  });
});
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
        if (results[0].email == email && results[0].senha == senha) {
          return res.json({ token: true, dados: results });
        }
      })
    }
  })
});

app.listen(3001, () => {
  console.log("Servidor rodando...");
})