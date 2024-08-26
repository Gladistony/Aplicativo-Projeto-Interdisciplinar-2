<?php
session_start();

$userInfo = $_SESSION['userInfo'];
$fotoPerfil = isset($userInfo['fotoPerfil']) ? $userInfo['fotoPerfil'] : '../Recursos/Imagens/perfil-teste.avif';
$nomeUsuario = isset($userInfo['nome']) ? $userInfo['nome'] : 'Usuário';
?>
<section id="menu-topo">
    <div class="top-bar">
        <div class="logo">
            Monitor<span>&a</span>
        </div>
        <div class="user-profile">
            <img src="<?php echo htmlspecialchars($fotoPerfil); ?>" alt="Foto do Usuário">
            <button onclick="toggleDropdown()">
                <span class="user-name"><?php echo htmlspecialchars($nomeUsuario); ?></span>
                <button onclick="location.href='logout.php'">Sair</button>
                <span class="arrow-down">&#x02C5;</span> <!-- Unicode for modifier letter down arrowhead -->
            </button>
            <div class="dropdown" id="dropdown">
                <button onclick="location.href='logout.php'">Sair</button>
            </div>
        </div>
    </div>
</section>

<script> /* este é o script do botão de sair. Por enquanto está desabilitado.
    function toggleDropdown() {
        var dropdown = document.getElementById('dropdown');
        if (dropdown.style.display === 'none' || dropdown.style.display === '') {
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    }

    window.onclick = function (event) {
        if (!event.target.matches('.user-profile button, .user-profile button *')) {
            var dropdown = document.getElementById('dropdown');
            if (dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
            }
        }
    }
</script>
<style>
    body {
        margin: 0;
        font-family: 'Poppins-Regular';
        background-color: #f5f5f5;
    }

    .top-bar {
        background-color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
        position: relative;
    }

    section#menu-topo>div.top-bar > div.logo {
    display: none ; /* desaparece com a logo*/
    }

    section#menu-topo {
        width: 100%;
    }

    section#menu-topo>div.top-bar {
        display: flex;
        justify-content: flex-end;
        width: 1070px;
    }

    section#menu-topo.div.top-bar>div.user-profile>div.dropdown {
        position: relative;
        left:0px;
        width: 500px;
    }


    .logo {
        font-family: 'Poppins-Bold', sans-serif;
        font-weight: 700;
        font-size: 30px;
        color: #1F1F1F;
    }

    .logo span {
        font-family: 'Poppins-Bold' !important; 
        color: #F0394F;
    }

    span.user-name{
        font-family: 'Poppins-Bold' !important; 
    }

    .user-profile {
        display: flex;
        align-items: center;
        position: relative;
    }

    .user-profile button {
        background: none;
        border: none;
        cursor: pointer;
        font-family: 'Poppins-Bold', sans-serif;
        font-size: 16px;
        font-weight: 400;
        color: #333;
        display: flex;
        align-items: center;
    }

    .user-profile img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
    }

    .dropdown {
        display: none;
        position: absolute;
        top: 50px;
        right: 0;
        background-color: #ffffff;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1;
        min-width: 100px;
    }

    .dropdown button {
        width: 100%;
        padding: 10px;
        border: none;
        background: none;
        cursor: pointer;
        font-family: 'Poppins-Regular', sans-serif;
        font-size: 16px;
        font-weight: 400;
        color: #333;
        text-align: left;
    }

    .dropdown button:hover {
        background-color: #f5f5f5;
    }

    .user-name {
        margin-right: 2px;
    }

    .arrow-down {
        font-size: 16px;
        line-height: 1;
        vertical-align: middle;
        margin-left: 5px;
    }
</style>