<?php
session_start();
$userInfo = $_SESSION['userInfo'];
$fotoPerfil = isset($userInfo['fotoPerfil']) ? $userInfo['fotoPerfil'] : '../Recursos/Imagens/perfil-teste.avif';
?>
<section id="menu-topo">
    <img alt="Foto do Usuário" class="user-photo" src="<?php echo htmlspecialchars($fotoPerfil); ?>" />
    <button onclick="location.href='logout.php'">Sair</button>
</section>