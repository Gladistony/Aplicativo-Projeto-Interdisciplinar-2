<?php
session_start();
$email = $_SESSION['email'];
$userInfo = $_SESSION['userInfo'];
$verificado = $_SESSION['verificado'];
?>
<link rel="stylesheet" href="../Styles/estilo_menu-perfil.css">
<section id="perfil">
    <div class="d-inline-block">
        <img src="https://images.unsplash.com/photo-1567324216289-97cc4134f626?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"/>
    </div>
    <h1 class="mt-2"><?php echo htmlspecialchars($userInfo['nome']); ?></h1>
    <h2><?php echo htmlspecialchars($email); ?></h2>
    <p class="mb-1">Cursando <?php echo htmlspecialchars($userInfo['curso']); ?></p>
    <p class="mb-1">Período de ingresso: 2024.1</p>
    <p class="mb-1">Data de nascimento: 17/06/2001</p>
    <h3 class="mb-1 mt-3">Descrição</h3>
    <textarea class="p-2 border border-dark rounded w-75" placeholder="Fale mais sobre você..."></textarea>
    <div class="d-grid gap-2 mt-4 w-50 mx-auto">
        <button class="btn btn-light border border-dark text-dark px-4 rounded">
            <span class="material-icons">edit</span> Editar minha foto de perfil
        </button>
        <button class="btn btn-light border border-dark text-dark px-4 rounded">
            <span class="material-icons">location_on</span> Editar meu endereço
        </button>
    </div>
</section>