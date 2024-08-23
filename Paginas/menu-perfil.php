<?php
session_start();
$email = $_SESSION['email'];
$userInfo = $_SESSION['userInfo'];
$verificado = $_SESSION['verificado'];
$periodo = isset($userInfo['periodo']) ? $userInfo['periodo'] : 'Não informado';
$nascimento = isset($userInfo['nascimento']) ? $userInfo['nascimento'] : 'Não informado';
$descricao = isset($userInfo['descricao']) ? $userInfo['descricao'] : 'Não informado';
$fotoPerfil = isset($userInfo['fotoPerfil']) ? $userInfo['fotoPerfil'] : '../Recursos/Imagens/perfil-teste.avif';
$dataCriacao = isset($userInfo['dataCriacao']) ? $userInfo['dataCriacao'] : 'Data não disponível';
?>
<link rel="stylesheet" href="../Styles/estilo_menu-perfil.css">
<section id="perfil">
    <div class="d-inline-block">
        <img id="profileImage" src="<?php echo htmlspecialchars($fotoPerfil); ?>" />
    </div>
    <h1 class="mt-2"><?php echo htmlspecialchars($userInfo['nome']); ?></h1>
    <h2><?php echo htmlspecialchars($email); ?></h2>
    <?php if (!$verificado) : ?>
        <div class="alert">
            <h2>Sua conta ainda não está verificada. Por favor, verifique seu e-mail.</h2>
        </div>
    <?php endif; ?>
    <p class="mb-1">Cursando <?php echo htmlspecialchars($userInfo['curso']); ?></p>
    <p class="mb-1">Período de ingresso: <?php echo htmlspecialchars($periodo); ?></p>
    <p class="mb-1">Data de nascimento: <?php echo htmlspecialchars($nascimento); ?></p>
    <p class="mb-1">Data de criação do perfil: <?php echo htmlspecialchars($dataCriacao); ?></p>
    <h3 class="mb-1 mt-3">Descrição</h3>
    <textarea placeholder="Fale mais sobre você..." readonly><?php echo htmlspecialchars($descricao); ?></textarea>
    <div class="d-grid gap-2 mt-4 w-50 mx-auto">
        <input type="file" id="profilePictureInput" accept="image/*" style="display: none;" />
        <div id="loading-fotoperfil" class="loading-spinner" style="display: none;"></div>
        <button id="botaoloadfoto" onclick="document.getElementById('profilePictureInput').click();">
            Editar minha foto de perfil
        </button>
        <button>
            Editar meu endereço
        </button>
    </div>
</section>