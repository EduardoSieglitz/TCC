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
    { dia } = req.body,
    { mes } = req.body,
    { ano } = req.body,
    dataNascimento = ano + "-" + mes + "-" + dia,
    sql = "INSERT INTO cliente (nome, senha, email, datanascimento) VALUES (?,?,?,?);";
  db.query(sql, [nome, senha, email, dataNascimento], (erro, result) => {
    if (erro){ return res.json({message : "Erro no Cadastro"})};
    if (result.length > 0) return res.json({message : "Cadastrado"});
  });
});
//

//Login de Usuario
app.post("/login/auth", (req, res) => {
  const { email } = req.body,
    { senha } = req.body;
  sql = "select * from cliente where email = ? and senha = ?;";
  db.query(sql, [email, senha], (erro, result) => {
    if (erro){ return res.json({message : "Erro no Login"})};
    if (result.length > 0) { return res.json({Login : true}); };
  });
});
//

app.listen(3001, () => {
  console.log("Servidor rodando...");
});