const express = require("express"),
    router = express.Router(),
    bodyParser = require("body-parser"),
    slug = require("slug"),
    cliente = require("./tabelaCliente");

router.use(bodyParser.urlencoded({ extended: true }));
router.post("/cadastroCliente", (req, res) => {
    
    var diaNascimento = req.body.dianascimento,
        mesNascimento = req.body.mesnascimento,
        anoNascimento = req.body.anonascimento,
        nomeForm = req.body.nome,
        emailForm = req.body.email,
        senhaForm = req.body.senha,
        dataNascimentoForm = anoNascimento + '-' + mesNascimento + '-' + diaNascimento;
    cliente.create({
        nome: nomeForm,
        email: emailForm,
        senha: senhaForm,
        datanascimento: dataNascimentoForm
    }).then(() => {
        res.redirect("/")
    });
});
module.exports = router;