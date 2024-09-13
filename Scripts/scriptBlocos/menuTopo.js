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