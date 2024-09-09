<?php
$arquivo = 'patch-notes.txt';

// Verifica se a requisição foi feita via POST para salvar as alterações
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Pega o conteúdo do textarea
    $novidades = $_POST['novidades'];

    // Salva o conteúdo no arquivo
    file_put_contents($arquivo, $novidades);

    // Redireciona de volta para evitar reenvio do formulário
    header('Location: index.php');
    exit();
}

// Exibe o conteúdo do patch notes
if (file_exists($arquivo)) {
    // Lê o conteúdo do arquivo
    $notas = file_get_contents($arquivo);
} else {
    // Caso o arquivo não exista, inicializa com uma mensagem padrão
    $notas = "Nenhum patch note disponível no momento.";
}
?>

<!-- Exibição das Patch Notes -->
<div class="patch-notes">
    <h2>Patch Notes - Novidades do Sistema</h2>
    <div class="notas">
        <?php echo nl2br($notas); // Exibe o conteúdo com quebras de linha ?>
    </div>
    
    <!-- Formulário para editar as Patch Notes -->
    <form action="patch    <?php
    session_start();
    
    // Verifica se o usuário está autenticado e tem permissão para editar
    $isAuthorized = isset($_SESSION['user']) && $_SESSION['user']['role'] === 'admin';
    
    $arquivo = 'patch-notes.txt';
    
    if (file_exists($arquivo)) {
        // Lê o conteúdo do arquivo
        $notas = file_get_contents($arquivo);
    } else {
        // Caso o arquivo não exista, inicializa com uma mensagem padrão
        $notas = "Nenhum patch note disponível no momento.";
    }
    ?>
    
    <!-- Exibição das Patch Notes -->
    <div class="patch-notes">
        <h2>Patch Notes - Novidades do Sistema</h2>
        <div class="notas">
            <?php echo nl2br($notas); // Exibe o conteúdo com quebras de linha ?>
        </div>
        
        <?php if ($isAuthorized): ?>
        <!-- Formulário para editar as Patch Notes -->
        <form action="patch-notes.php" method="POST">
            <textarea name="novidades" rows="10" cols="50"><?php echo htmlspecialchars($notas); ?></textarea>
            <br>
            <button type="submit">Atualizar Patch Notes</button>
        </form>
        <?php endif; ?>
    </div>-notes.php" method="POST">
        <textarea name="novidades" rows="10" cols="50"><?php echo htmlspecialchars($notas); ?></textarea>
        <br>
        <button type="submit">Atualizar Patch Notes</button>
    </form>
</div>
