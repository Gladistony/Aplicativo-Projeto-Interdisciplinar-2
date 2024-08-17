<?php
// login.php
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Aqui você pode adicionar a lógica para verificar o login no Firebase
    // e redirecionar o usuário para outra página

    header('Location: dashboard.php');
    exit();
}
