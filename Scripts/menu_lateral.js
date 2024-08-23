document.addEventListener('DOMContentLoaded', function () {
    const menuLinks = document.querySelectorAll('.menu-link');
    const contentContainer = document.getElementById('conteudo_principal');

    menuLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            // Remove a classe ativa de todos os links
            menuLinks.forEach(link => link.classList.remove('active'));

            // Adiciona a classe ativa ao link clicado
            this.classList.add('active');

            // Carrega o novo conteúdo
            const contentId = this.getAttribute('data-content');
            loadContent(contentId);
            alert("Conteúdo carregado para: " + contentId);
        });
    });

    function loadContent(contentId) {
        // Limpa o conteúdo atual
        contentContainer.innerHTML = '';

        // Carrega o novo conteúdo (exemplo simples)
        contentContainer.innerHTML = `<p>Conteúdo carregado para: ${contentId}</p>`;
    }
});
