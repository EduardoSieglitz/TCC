const express = require("express"),
  app = express(),
  conexao = require("./database/bancodados.js"),
  Cliente = require("./cadastroCliente/tabelaCliente.js"),
  controleCliente = require("./cadastroCliente/controleCliente.js");
  app.use("/", controleCliente);

conexao.authenticate().then(() => {
  console.log("Tudo ok")
}).catch((msg) => {
  console.log(msg);
});

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("entrar");
});

app.get("/cadastroForm", (req, res) => {
  res.render("cadastrar");
});

app.get("/entrar", (req, res) => {
  res.render("inicio");
});

app.listen(3000, () => {
  console.log("Servidor rodando...");
});