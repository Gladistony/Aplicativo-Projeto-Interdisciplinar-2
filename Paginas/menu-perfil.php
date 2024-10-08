<?php
session_start();
$email = $_SESSION['email'];
$userInfo = $_SESSION['userInfo'];
$verificado = $_SESSION['verificado'];
/* Modificado o uso da função isset() para o operador de coalescência nula (??). Traz melhor legibilidade.
Só funciona a partir do PHP 7; Caso este código não esteja na versão 7, alterar de volta à como estava antes. 
O backup do código anterior se encontra como comentário logo abaixo. */

$periodo = $userInfo['periodoIngresso'] ?? 'Não informado';
$nascimento = $userInfo['dataNascimento'] ?? 'Não informado';
$descricao = $userInfo['descricao'] ?? 'Não informado';
$fotoPerfil = $userInfo['fotoPerfil'] ?? '../Recursos/Imagens/perfil-teste.avif';
$dataCriacao = $userInfo['dataCriacao'] ?? 'Data não disponível';

/*
$periodo = isset($userInfo['periodoIngresso']) ? $userInfo['periodoIngresso'] : 'Não informado';
$nascimento = isset($userInfo['dataNascimento']) ? $userInfo['dataNascimento'] : 'Não informado';
$descricao = isset($userInfo['descricao']) ? $userInfo['descricao'] : 'Não informado';
$fotoPerfil = isset($userInfo['fotoPerfil']) ? $userInfo['fotoPerfil'] : '../Recursos/Imagens/perfil-teste.avif';
$dataCriacao = isset($userInfo['dataCriacao']) ? $userInfo['dataCriacao'] : 'Data não disponível';
*/
$currentYear = date("Y");
?>
<link rel="stylesheet" href="../Styles/estilo_menu-perfil.css">
<section id="perfil">
    <div class="imagem">
        <img id="profileImage" src="<?php echo htmlspecialchars($fotoPerfil); ?>" />
    </div>
    <h1 id="nomeContainer">
        <span id="nome" class="input-nome-fonte"><?php echo htmlspecialchars($userInfo['nome']); ?></span>
    </h1>
    <h2><?php echo htmlspecialchars($email); ?></h2>
    <?php if (!$verificado) : ?>
        <div class="alert">
            <h4>Sua conta ainda não está verificada. Por favor, verifique seu e-mail.</h4>
        </div>
        <button class="btn-editar" id="reenviarEmailBtn" onclick="reenviaremail()">
            <img class="icone" src="../Recursos/Imagens/mail.png" alt="icone-email">
            Reenviar e-mail de verificação
        </button>
    <?php endif; ?>
    <p>Cursando <span class="curso"><?php echo htmlspecialchars($userInfo['curso']); ?></span></p>
    <p>Período de ingresso:
        <select id="periodo" class="periodo-fonte" disabled>
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
    <p>Data de nascimento: <input type="date" id="nascimento" class="input-data-fonte" value="<?php echo htmlspecialchars($nascimento); ?>" readonly></p>
    <p>Data de criação do perfil: <span class="data-criacao"><?php echo htmlspecialchars($dataCriacao); ?></span></p>
    <h3>Descrição</h3>
    <textarea id="descricao" class="descricao-fonte" placeholder="Fale mais sobre você..." readonly><?php echo htmlspecialchars($descricao); ?></textarea>
    <input type="password" id="senha" class="input-senha-fonte" placeholder="Nova senha" style="display: none;">
    <input type="password" id="senhaconfirm" class="input-senha-fonte" placeholder="Confime a Nova senha" style="display: none;">
    <small id="senhaAviso" class="aviso-senha" style="display: none;">Lembre-se, a senha deve conter 8 caracteres.</small>
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