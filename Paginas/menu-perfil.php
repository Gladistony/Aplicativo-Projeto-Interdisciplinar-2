<?php
session_start();
$email = $_SESSION['email'];
$userInfo = $_SESSION['userInfo'];
$verificado = $_SESSION['verificado'];
$periodo = isset($userInfo['periodoIngresso']) ? $userInfo['periodoIngresso'] : 'Não informado';
$nascimento = isset($userInfo['dataNascimento']) ? $userInfo['dataNascimento'] : 'Não informado';
$descricao = isset($userInfo['descricao']) ? $userInfo['descricao'] : 'Não informado';
$fotoPerfil = isset($userInfo['fotoPerfil']) ? $userInfo['fotoPerfil'] : '../Recursos/Imagens/perfil-teste.avif';
$dataCriacao = isset($userInfo['dataCriacao']) ? $userInfo['dataCriacao'] : 'Data não disponível';
$currentYear = date("Y");
?>
<link rel="stylesheet" href="../Styles/estilo_menu-perfil.css">
<section id="perfil">
    <div class="imagem">
        <img id="profileImage" src="<?php echo htmlspecialchars($fotoPerfil); ?>" />
    </div>
    <h1><?php echo htmlspecialchars($userInfo['nome']); ?></h1>
    <h2><?php echo htmlspecialchars($email); ?></h2>
    <?php if (!$verificado) : ?>
        <div class="alert">
            <h4>Sua conta ainda não está verificada. Por favor, verifique seu e-mail.</h4>
        </div>
    <?php endif; ?>
    <p>Cursando <?php echo htmlspecialchars($userInfo['curso']); ?></p>
    <p>Período de ingresso:
        <select id="periodo" disabled>
            <?php for ($year = 2019; $year <= $currentYear; $year++) : ?>
                <option value="<?php echo $year . '.1'; ?>" <?php echo ($year . '.1' == $periodo) ? 'selected' : ''; ?>>
                    <?php echo $year . '.1'; ?>
                </option>
                <option value="<?php echo $year . '.2'; ?>" <?php echo ($year . '.2' == $periodo) ? 'selected' : ''; ?>>
                    <?php echo $year . '.2'; ?>
                </option>
            <?php endfor; ?>
        </select>
    </p>
    <p>Data de nascimento: <input type="date" id="nascimento" value="<?php echo htmlspecialchars($nascimento); ?>" readonly></p>
    <p>Data de criação do perfil: <?php echo htmlspecialchars($dataCriacao); ?></p>
    <h3>Descrição</h3>
    <textarea id="descricao" placeholder="Fale mais sobre você..." readonly><?php echo htmlspecialchars($descricao); ?></textarea>
    <div class="button-container">
        <input type="file" id="profilePictureInput" accept="image/*" style="display: none;" />
        <div id="loading-fotoperfil" class="loading-spinner" style="display: none;"></div>
        <button class="btn-editar" id="botaoloadfoto" onclick="document.getElementById('profilePictureInput').click();">
            <img id="botaoloadfoto" class="icone" src="../Recursos/Imagens/editar.png" alt="icone-editar">
            Editar minha foto de perfil
        </button>
        <button class="btn-editar" id="editarPerfilBtn">
            <img class="icone" src="../Recursos/Imagens/user.png" alt="icone-user">
            Editar perfil
        </button>
    </div>
</section>