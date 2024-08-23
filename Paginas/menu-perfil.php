<?php
session_start();
$email = $_SESSION['email'];
$userInfo = $_SESSION['userInfo'];
$verificado = $_SESSION['verificado'];
?>
<section class="bg-white shadow p-4 rounded mx-auto text-center m-3 w-50">
    <div class="d-inline-block">
        <img src="https://images.unsplash.com/photo-1567324216289-97cc4134f626?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="User Profile Picture" class="img-fluid rounded-circle"
            style="width: 250px; height: 250px; object-fit: cover;" />
    </div>
    <h2 class="mt-2"><?php echo htmlspecialchars($userInfo['nome']); ?></h2>
    <h5><strong><?php echo htmlspecialchars($email); ?></strong></h5>
    <p class="mb-1">Cursando <?php echo htmlspecialchars($userInfo['curso']); ?></p>
    <p class="mb-1">Período de ingresso: 2024.1</p>
    <p class="mb-1">Data de nascimento: 17/06/2001</p>
    <p class="mb-1">Endereço: Rua Moradas, nº 123 - Belo Jardim, PE</p>
    <h4 class="mb-1 mt-3">Descrição</h4>
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