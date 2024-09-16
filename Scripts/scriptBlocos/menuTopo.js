function loadMenutopo() {
    const botaodrop = document.getElementById('botao-drop-sair');
    if (botaodrop) {
        botaodrop.addEventListener('click', function () {
            location.href = 'logout.php'
        });
    }
    const botaodropdw = document.getElementById('botao-drop-down');
    if (botaodropdw) {
        botaodropdw.addEventListener('click', toggleDropdown);
    }
    const botaoperfil = document.getElementById('botao-drop-seu-Perfil');
    const meuid = window.sessionData.id;
    botaoperfil.href = './main-logado.php?pagina=perfilpublico&id=' + meuid;
}
function toggleDropdown() {
    var dropdown = document.getElementById('dropdown');
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}


export { loadMenutopo };