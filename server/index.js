const { json } = require("body-parser");

const express = require("express"),
  app = express(),
  mysql = require("mysql2"),
  cors = require("cors");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "cliente",
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Tudo, ok")
});

app.post("/registrar", (req, res) => {
  console.log("opa")
  var { nome } = req.body,
    { email } = req.body,
    { senha } = req.body,
    { dia } = req.body,
    { mes } = req.body,
    { ano } = req.body,
    dataNascimento = ano + "-" + mes + "-" + dia,
    sql = "INSERT INTO tb_cliente (nome, senha, email, datanascimento) VALUES (?,?,?,?);";
  db.query(sql, [nome, senha, email, dataNascimento], (erro, result) => {
    console.log(erro)
  });
});

app.listen(3001, () => {
  console.log("Servidor rodando...");
});