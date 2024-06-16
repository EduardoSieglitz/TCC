<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./Css/styleLink.css">
    <title>BemEstarTotal.com</title>
  </head>
  <body>
    <nav id="nav">
      <div class="ControlIndex">
          <div class="ControleMenu">
            <div class="MenuLeft">
              <h2>Paginas:</h2>
            </div>
              <div class="MenuRight" id="MenuRight">
                <div class="Menu"></div><div class="Menu"></div><div class="Menu"></div>
              </div>
          </div>
          <div class="flex">
              <div class="LinhaMedia"></div>
            <div class="Logo">
              <img src="./img/Logo.png" alt="">
            </div>
            <div class="Inicio">
              <a href="./index.php">Início</a>
            </div>
              <div class="LinhaMedia"></div>
            <div class="Saudemental">
              <a href="./Saudemental.php">Saúde Mental</a>
            </div>
              <div class="LinhaMedia"></div>
            <div class="Treino">
              <a href="./Treino">Treino</a>
            </div>
              <div class="LinhaMedia"></div>
            <div class="Alimentacao">
              <a href="./Alimentacao.php">Alimentação</a>
            </div>
              <div class="LinhaMedia"></div>
            <div class="Outros">
              <a href="./Outros.php">Outros</a>
            </div>
               <div class="LinhaMedia"></div>
          </div>
      </div>
      <center>
        <div class="Linha"></div>
      </center>
      <?php
        include "Inicio.php";
      ?>
    </nav>
    <script src="./Script/scriptLink.js"></script>
  </body>
</html>