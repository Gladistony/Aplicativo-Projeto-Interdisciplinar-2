<div class="add-turma" id="addTurmaBotaoadd">
    <button id="addTurmaBtn">Adicionar Nova Turma</button>
</div>
<!-- Modal -->
<div id="addTurmaModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Adicionar Nova Turma</h2>
        <form id="addTurmaForm">
            <label for="nome">Nome da Disciplina:</label><br>
            <input type="text" id="nome" name="nome" required minlength="5"><br>
            <label for="periodo">Período:</label><br>
            <input type="text" id="periodo" name="periodo" required pattern=".{6}" maxlength="6"><br>
            <label for="icone">URL da Imagem:</label><br>
            <input type="url" id="icone" name="icone" required><br><br>
            <input type="submit" value="Cadastrar">
        </form>
    </div>
</div>
<!-- Lista de forum -->
<div class="forum-container">
    <?php
    session_start();
    $forum = $_SESSION['forum'];

    foreach ($forum as $turma) {
        echo "<div class='turma'>";
        echo "<img src='{$turma['icone']}' alt='Ícone da Turma'>";
        echo "<h2>{$turma['nome']}</h2>";
        echo "<p>Professor: {$turma['professor']}</p>";
        echo "<div class='subtopicos'>";
        echo "<h3>Subtópicos:</h3>";
        foreach ($turma['subtopicos'] as $subtopico) {
            echo "<div class='subtopico'>";
            echo "<a href='../Paginas/main-logado.php?pagina=subforum&id={$subtopico['id']}'>{$subtopico['nome']}</a>";
            echo "</div>";
        }
        echo "</div>";
        echo "</div>";
    }
    ?>
</div>