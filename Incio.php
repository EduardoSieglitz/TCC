<?php
    include "index.html";
    session_start();
    if(isset($_SESSION['email'])){
        $_SESSION['email'];
    }
?>
    <head>
    <link rel="stylesheet" href="./CSS/styleInicio.css">
    </head>
    <div class="Container">
        <div class="Left">
                <h1>Bem-vindo à Plataforma Bem Estar Total</h1>
                <h2>Acompanhe sua Saúde de Forma Inteligente</h2>
                <p>Na Plataforma Bem Estar Total, estamos comprometidos em ajudar você a cuidar do seu bem-estar físico e mental.
                Nossa abordagem integrada permite que você rastreie vários aspectos da sua saúde de maneira eficiente e eficaz.</p>
        </div>
        <div class="Right">
            <img src="./img/10-dicas-vida-saudavel-1-1024x683.png" alt="">
        </div>
    </div>
       
       
