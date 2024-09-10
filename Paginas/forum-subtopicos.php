<?php
if (isset($_GET['id'])) {
    $turmaId = $_GET['id'];
    $nome = $_GET['nome'];
} else {
    $turmaId = 0;
    $nome = "Turma";
}
?>
<h1>Tópicos Nome: <?php echo $nome; ?></h1>
<button onclick="criarNovoTopico('<?php echo htmlspecialchars($turmaId); ?>')">Criar Novo Tópico</button>
<ul id="topicos"></ul>