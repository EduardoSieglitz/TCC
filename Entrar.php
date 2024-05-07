<?php 
    session_start();
?>
<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <title>BemEstarTotalLogin.com</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <link rel="stylesheet" href="./CSS/styleLogin.css">
    </head> 
    <body>
        <?php
            $connection = new PDO("mysql:local=localhost;dbname=bemestartotal;port=3306", "root", "");
            $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);
            if(!empty($dados)){
                var_dump($dados);
                $sql = "SELECT * FROM tb_cliente WHERE email = :email and senha = :senha;";
                $_SESSION['email'] = $dados['email'];
                $consulta = $connection->prepare($sql);
                $consulta->bindParam(':email', $dados['email']);
                $consulta->bindParam(':senha', $dados['senha']);
                $consulta->execute();
                if($row = $consulta->fetch()){ 
                    header("Location: Incio.php");
                }
            }
        ?>
        <div class="Container"> 
            <thead>
                <div class="Left">
                    <div class="Texto">
                        <h1 class="h1">Bem Estar Total</h1>
                        <p class="p">Muito mais do que um site, é um convite para uma vida mais saudável e plena. Se junte a nós enquanto embarcamos
                        nesta jornada para uma vitalidade completa.</p>
                    </div>
                </div>
            </thead>   
            <div class="Right">
                <div class="Login">
                    <form id="form" method="POST">
                        <div class="emailerro">
                            <div class="emailsuce">
                                <input class="inputLogin" type="text" id="email" name="email" placeholder="Email" style="margin-top: 5px;">
                                <small>Erro menssage</small>
                            </div>
                        </div>
                        <div class="senhaerro">
                            <div class="senhasuce">
                                <input class="inputLogin" type="password" id="senha" name="senha" placeholder="Senha">
                                <small>Erro menssage</small>
                            </div>
                        </div>
                        <button class="inputButton" id="Enviar" name='Enviar' onClick="enviar()">Entrar</button>
                    </form>
                    <a class="hrefLogin" href="Cadastrar.php">Esqueceu a senha?</a>
                    <div class="linhaLogin"><br></div>
                    <a href="Cadastrar.php"><button class="inputButton2">Criar conta</button></a>
                </div>
            </div>
        </div>
        <script src="./Script/scriptEmail.js"></script>
    </body>
</html>
