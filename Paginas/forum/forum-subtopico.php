<div class="container">
    <div id="spinner" class="spinner"></div>
    <div id="content" class="topico" style="display: none;">
        <h1 id="titulo">Título do Subfórum</h1>
        <div id="topicos"></div>
        <div class="add-topico">
            <button id="addTopicoBtn">Adicionar Novo Tópico</button>
        </div>
    </div>
</div>

<!-- Modal -->
<div id="addTopicoModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Adicionar Novo Tópico</h2>
        <form id="addTopicoForm">
            <label for="tituloTopico">Título do Tópico:</label><br>
            <input type="text" id="tituloTopico" name="tituloTopico" required minlength="5"><br>
            <label for="conteudoTopico">Conteúdo:</label><br>
            <textarea id="conteudoTopico" name="conteudoTopico" required></textarea><br><br>
            <input type="submit" value="Cadastrar">
        </form>
    </div>
</div>