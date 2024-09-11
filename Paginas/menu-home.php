<?php
session_start();

// Definindo o nome do usuário para exibição
$userInfo = $_SESSION['userInfo'];
$nome = $userInfo['nome'];

// Definições Gerais
$infoGeral = $_SESSION['infoConfig'];
$boas_vindas = $infoGeral['MsgBoasVindas'];
$periodo = $infoGeral['Periodo'];
$avisos = $infoGeral['Avisos'];

// Obtendo a data atual
$dataAtual = date('d/m/Y H:i:s');

// Definindo a saudação com base no horário
$hora = date('H');
if ($hora < 12) {
    $saudacao = "Bom dia";
} elseif ($hora < 18) {
    $saudacao = "Boa tarde";
} else {
    $saudacao = "Boa noite";
}
?>

<div class="container">
    <h1><?php echo $boas_vindas; ?></h1>
    <div class="saudacao"><?php echo $saudacao; ?>, <?php echo $nome; ?>!</div>
    <div class="periodo">Período: <?php echo $periodo; ?></div>
    <div id="relogio" class="relogio"></div>
    <div class="avisos">
        <div class="aviso">Avisos:</div>
        <?php foreach ($avisos as $aviso): ?>
            <div class="aviso"><?php echo $aviso; ?></div>
        <?php endforeach; ?>
    </div>
</div>