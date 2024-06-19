const express = require("express"),
app = express();

app.set("view engine", "ejs");
app.use(express.static("CSS"));
app.use(express.static("img"))

app.get("/", (req, res)=>{
    res.render("index");
});

app.listen(3000, ()=>{
    console.log("Servidor rodando");
});