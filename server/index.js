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
    Usuario = "Clien"
  sql = "INSERT INTO usuario (nome, senha, email, telefone, nivel) VALUES (?, ?, ?, ?, ?);";
  db.query(sql, [nome, senha, email, telefone, Usuario], (erro, result) => {
    if (erro) { return res.json({ message: "Erro no Cadastro" }) };
    if (result.length > 0) return res.json({ message: "Cadastrado" });
  });
});
//

//Login de Usuario
app.post("/login/auth", async (req, res) => {
  const { email } = req.body,
    { senha } = req.body;

  sql = "select * from usuario where email = ? and senha = ?;";
  db.query(sql, [email, senha], (erro, result) => {
    console.log(result)
    if (erro) { return res.json({ token: false }) };
    if (result.length > 0) { return res.json({ token: true, usuario: result }); } else { return res.json({ token: false }) };
  });
});
//

app.listen(3001, () => {
  console.log("Servidor rodando...");
});