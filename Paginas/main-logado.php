<?php
session_start();
if (!isset($_SESSION['email'])) {
    header('Location: ../index.html');
    exit();
}

$email = $_SESSION['email'];
$userInfo = $_SESSION['userInfo'];
$verificado = $_SESSION['verificado'];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo</title>
    <script type="module" src="../Scripts/main-logado.js"></script>
</head>

<body>
    <div id="menu_do_topo" class="top-menu">
    </div>
    <div class="container">
        <div class="sidebar-menu">
            <!-- Aqui será carregado o menu de outro arquivo HTML -->
        </div>
        <div class="main-content">
            <!-- Conteúdo principal de outro arquivo html -->
        </div>
        <div class="sidebar-chat">
            <!-- Bloco de chat de outro arquivo html -->
        </div>
    </div>
</body>

</html>