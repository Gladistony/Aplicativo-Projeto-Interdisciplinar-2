<?php
session_start();

$userInfo = $_SESSION['userInfo'];
$nomeCompleto = isset($userInfo['nome']) ? $userInfo['nome'] : 'Usuário';
$partesNome = explode(' ', $nomeCompleto);

if (count($partesNome) > 1) {
    $primeiroNome = $partesNome[0];
    $ultimoNome = end($partesNome);
    $nomeUsuario = $primeiroNome . ' ' . $ultimoNome;
} else {
    $nomeUsuario = $nomeCompleto;
}

$fotoPerfil = isset($userInfo['fotoPerfil']) ? $userInfo['fotoPerfil'] : '../Recursos/Imagens/perfil-teste.avif';
?>
<section id="menu-topo">
    <a href="#">
        <img alt="Foto do Usuário" class="user-photo" src="<?php echo htmlspecialchars($fotoPerfil); ?>">
    </a>

    <div class="user-profile">
        <button id="botao-drop-down">
            <span class="user-name"><?php echo htmlspecialchars($nomeUsuario); ?></span>
            <span class="arrow-down"><img src="../Recursos/Imagens/Seta-para-baixo.png" alt=""></span>
        </button>
        <div class="dropdown" id="dropdown" style="display: none;">
            <a href="#" id="botao-drop-seu-Perfil" class="botao-link">Seu perfil</a>
            <button id="botao-drop-sair" class="botao-link">Sair</button>
        </div>
    </div>
</section>