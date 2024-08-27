<?php
session_start();

$userInfo = $_SESSION['userInfo'];
$fotoPerfil = isset($userInfo['fotoPerfil']) ? $userInfo['fotoPerfil'] : '../Recursos/Imagens/perfil-teste.avif';
$nomeUsuario = isset($userInfo['nome']) ? $userInfo['nome'] : 'Usuário';
?>
<section id="menu-topo">
    <div class="logo">
        Monitor<span>&a</span>
    </div>
    <img alt="Foto do Usuário" class="user-photo" src="<?php echo htmlspecialchars($fotoPerfil); ?>" />
    <div class="user-profile">
        <button id="botao-drop-down">
            <span class="user-name"><?php echo htmlspecialchars($nomeUsuario); ?></span>
            <span class="arrow-down">&#x02C5;</span> <!-- Unicode for modifier letter down arrowhead -->
        </button>
        <div class="dropdown" id="dropdown" style="display: none;">
            <button id="botao-drop-sair">Sair</button>
        </div>
    </div>
</section>