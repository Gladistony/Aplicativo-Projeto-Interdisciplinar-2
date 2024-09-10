<?php
if (isset($_GET['id'])) {
    $turmaId = $_GET['id'];
    $nome = $_GET['nome'];
} else {
    $turmaId = 0;
    $nome = "Turma";
}
?>
<h1 id="titulo-topico-forum"></h1>
<p id="conteudo-topico-forum"></p>
<p id="autor-topico-forum"></p>
<p id="data-topico-forum"></p>

<h2>Comentários</h2>
<ul id="comentarios-forum"></ul>

<textarea id="conteudoComentario" placeholder="Escreva seu comentário"></textarea>
<button onclick="comentar_topico('<?php echo htmlspecialchars($turmaId); ?>')">Comentar</button>