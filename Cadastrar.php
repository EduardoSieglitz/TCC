<!DOCTYPE html>
<html>
  <head>
    <title>BemEstarTotalCadastro.com</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <link rel="stylesheet" href="./CSS/styleCadastro.css">
  </head>
  <body>
    <?php
      $connection = new PDO("mysql:local=localhost;dbname=bemestartotal;port=3306", "root", "");
      $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
      if(!empty($dados)){
        var_dump($dados);
        $sql = "INSERT INTO tb_cliente(nome, sobrenome, email, senha, datadenascimento) VALUES (:nome, :sobrenome, :email, :senha, :datanascimento);";
        $add = $connection->prepare($sql);
        $add->bindParam(':nome', $dados['nome']);
        $add->bindParam(':sobrenome', $dados['sobrenome']);
        $add->bindParam(':email', $dados['email']);
        $add->bindParam(':senha', $dados['senha']);
        $data = $dados['anonascimento'] . '-' . $dados['mesnascimento'] . '-' . $dados['dianascimento'];
        $add->bindParam(':datanascimento', $data);
        $add->execute();
      }
    ?>
    <div class="Control">
      <div class="ControlCadastro">
        <thead class="ControlThead">
          <p class="ph1">Criar uma conta</p>
          <div class="linhaentrar"><br></div>
        </thead>
        <form  id="form" method="POST">
          <div class="nomeerro">
            <div class="nomesuce">
              <input class="inputentrar1" type="text" id="nome" name="nome" placeholder="Nome" style="margin-top: 25px;">
              <small>Erro menssage</small>
            </div>
          </div>
          <div class="sobreerro">
            <div class="sobresuce">
              <input class="inputentrar1" type="text" id="sobrenome" name="sobrenome" placeholder="Sobrenome">
              <small>Erro menssage</small>
            </div>
          </div>
          <div class="emailerro">
            <div class="emailsuce">
              <input class="inputentrar1" type="text" id="email" name="email" placeholder="Email" >
              <small>Erro menssage</small>
            </div>
          </div>
          <div class="senhaerro">
            <div class="senhasuce">
              <input class="inputentrar1" type="password" id="senha" name="senha" placeholder="Senha">
              <small>Erro menssage</small>
            </div>
          </div>
          <div class="data">
            <p>Data de nascimento</p>
            <br>
            <select class="inputentrar2" id="dianascimento" name="dianascimento">
              <?php
                for ($dia = 1; $dia <= 31; $dia++) {
                  echo "<option value='$dia'>$dia</option>";
                }        
              ?>
            </select>
            <select class="inputentrar2" id="mesnascimento" name="mesnascimento">
              <?php
                $meses = array('Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro');
                foreach ($meses as $indice => $mes) {
                  echo "<option value='" . ($indice + 1) . "'>$mes</option>";
                }
              ?>
            </select>
            <select class="inputentrar2" id="anonascimento" name="anonascimento">
              <?php
                for ($ano = date("Y"); $ano >= 1900; $ano--){
                  echo "<option value='$ano'>$ano</option>";
                }
              ?>
            </select><br><br>
          </div>
          <a><button class="inputbutton" id="Enviar" name='Enviar' onClick="enviar()">Criar Conta</button></a><br>
          <a class="aentrar" href="Entrar.php">Já tem uma conta?</a>
        </form>
      </div>
    </div>
    <script src="./Script/scriptCadastro.js"></script>
  </body>
</html>