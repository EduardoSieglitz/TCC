const { json } = require("body-parser"),
  express = require("express"),
  app = express(),
  db = require("./database/pool"),
  cors = require("cors");

app.use(cors());
app.use(json());

app.get("/", (req, res) => {
  res.send("Oi, como vai.")
});

//Cadastro de Usuario
app.post("/registrar", (req, res) => {
  var { nome } = req.body,
    { email } = req.body,
    { senha } = req.body,
    { dia } = req.body,
    { mes } = req.body,
    { ano } = req.body,
    dataNascimento = ano + "-" + mes + "-" + dia,
    sql = "INSERT INTO tb_cliente (nome, senha, email, datanascimento) VALUES (?,?,?,?);";
  db.query(sql, [nome, senha, email, dataNascimento], (erro, result) => {
    console.log(erro);
  }).then(() => {
    console.log("Cadastrado");
  });
});
//

//Login de Usuario
app.get("login", (req, res) => {
  var { email } = req.body,
    { senha } = req.body,
    sql = "SELECT * FROM tb_cliente WHERE email = ?, senha = ?;";
  db.query(sql, [email, senha], (erro, result) => {
    console.log(erro);
  }).then(() => {
    console.log("Logado");
  });
});
//

app.listen(3001, () => {
  console.log("Servidor rodando...");
});