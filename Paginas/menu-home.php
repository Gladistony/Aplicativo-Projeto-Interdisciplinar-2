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
date_default_timezone_set('America/Sao_Paulo');

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
    <!-- Mensagem de Boas-vindas -->
    <h1><?php echo $boas_vindas; ?></h1>

    <!-- Saudação personalizada com base no horário -->
    <div class="saudacao"><?php echo $saudacao; ?>, <?php echo $nome; ?>!</div>

    <!-- Informações de período -->
    <div class="periodo">Período: <?php echo $periodo; ?></div>

    <!-- Relógio exibindo a hora atual -->
    <div id="relogio" class="relogio"><?php echo $dataAtual; ?></div>

    <div class="avisos">
        <div class="aviso-hud">Avisos:</div>
        <?php foreach ($avisos as $aviso): ?>
            <div class="aviso"><?php echo $aviso; ?></div>
        <?php endforeach; ?>
    </div>
    <div class="nova-monitoria">
        <h2>Adicionar Nova Monitoria</h2>
        <form action="#" method="POST">
            <label for="nome-monitoria">Nome da Monitoria:</label>
            <input type="text" id="nome-monitoria" name="nome-monitoria" disabled>
            <br>
            <label for="descricao-monitoria">Descrição:</label>
            <textarea id="descricao-monitoria" name="descricao-monitoria" rows="4" cols="50" disabled></textarea>
            <br>
            <button type="submit" disabled>Adicionar Monitoria</button>
        </form>
    </div>

    <!-- Script para atualizar o relógio em tempo real -->
    <script>
        function atualizarRelogio() {
            const relogio = document.getElementById('relogio');
            const agora = new Date();
            const horas = String(agora.getHours()).padStart(2, '0');
            const minutos = String(agora.getMinutes()).padStart(2, '0');
            const segundos = String(agora.getSeconds()).padStart(2, '0');
            const data = agora.toLocaleDateString('pt-BR');
            relogio.innerHTML = `${data} ${horas}:${minutos}:${segundos}`;
        }
        setInterval(atualizarRelogio, 1000);
        atualizarRelogio();
    </script>