<?php
session_start();
$email = $_SESSION['email'];
$userInfo = $_SESSION['userInfo'];
$periodo = $userInfo['periodoIngresso'] ?? 'Não informado';
$nascimento = $userInfo['dataNascimento'] ?? 'Não informado';
$descricao = $userInfo['descricao'] ?? 'Não informado';
$fotoPerfil = $userInfo['fotoPerfil'] ?? '../Recursos/Imagens/perfil-teste.avif';
$dataCriacao = $userInfo['dataCriacao'] ?? 'Data não disponível';
$tipoConta = $userInfo['tipoConta'] ?? 'Erro na obtenção da informação';
$pontuacao = 3;
$arrayConquistas = array(
    array('../Recursos/Imagens/conquista1.png', "Olá! Me chamo...", "Adicione uma descrição ao seu perfil"),
    array('../Recursos/Imagens/conquista2.png', "Tenho uma dúvida", "Crie um tópico em um fórum")
);
// Definindo a cor da classe do usupario base no tipo de conta
if ($tipoConta === 'Aluno') {
    $corTipoConta = '#10648C'; // Azul para aluno
} elseif ($tipoConta === 'Monitor') {
    $corTipoConta = '#F0394F'; // Vermelho para monitor
} elseif ($tipoConta === 'Professor') {
    $corTipoConta = '#5E109B'; // Roxo para professor
}
?>
<link rel="stylesheet" href="../Styles/estilo_menu-perfil.css">

<section id="perfil">
    <div class="imagem">
        <img id="profileImage" src="<?php echo htmlspecialchars($fotoPerfil); ?>" />
        <div class="informacoes-usuario">
            <h1 class="nomeUsuarioFonte"><?php echo htmlspecialchars($userInfo['nome']); ?></h1>
            <h2><?php echo htmlspecialchars($email); ?></h2>
            <div class="botoes-usuario">
                <button id="botaoAmizade" class="addAmigo">
                    <img src="../Recursos/Imagens/add-amizade.png" alt="Adicionar Amizade" class="icone-amizade" />
                    Adicionar amizade
                </button>
                <button id="botaoPontuacao" class="pontuacao">Pontuação:
                    <?php echo htmlspecialchars($pontuacao); ?></button>
            </div>
        </div>
    </div>
    <p>
        <span class="cor-usuario" style="color: <?php echo $corTipoConta; ?>;">
            <?php echo htmlspecialchars($tipoConta); ?>
        </span>
        em <span class="curso"><?php echo htmlspecialchars($userInfo['curso']); ?></span>
    </p>
    <p>Período de ingresso: <span class="periodo-fonte"><?php echo htmlspecialchars($periodo); ?></span></p>
    <p>Data de criação do perfil: <span class="data-criacao"><?php echo htmlspecialchars($dataCriacao); ?></span></p>
    <h3>Descrição</h3>
    <textarea id="descricao" class="descricao-fonte" placeholder="Fale mais sobre você..."
        readonly><?php echo htmlspecialchars($descricao); ?></textarea>
    <h3>Conquistas deste usuário</h3>
    <div class="conImg">
        <?php
        foreach ($arrayConquistas as $conquista) {
            echo '<div class="conquista-container">';
            echo '<img class="conquista-img" src="' . htmlspecialchars($conquista[0]) . '" />';
            echo '<div class="conquista-texto">';
            echo '<p class="titulo-conquista">' . htmlspecialchars($conquista[1]) . '</p>';
            echo '<p class="descricao-conquista">' . htmlspecialchars($conquista[2]) . '</p>';
            echo '</div>';
            echo '</div>';
        }
        ?>
    </div>
</section>