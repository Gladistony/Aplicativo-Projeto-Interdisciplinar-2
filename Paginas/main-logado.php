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
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../Styles/estilo_main-logado.css">

</head>

<body>
    <div id="menu_do_topo" class="top-menu">
    </div>
    <div class="container">
        <div id="menu_do_lado" class="sidebar-menu">
            <!-- Aqui será carregado o menu de outro arquivo HTML -->
        </div>
        <div id="conteudo_principal" class="main-content">
            <!-- Conteúdo principal de outro arquivo html -->
        </div>
        <div id="barra_lado_chat" class="sidebar-chat">
            <!-- Bloco de chat de outro arquivo html -->
        </div>
    </div>
</body>

</html>