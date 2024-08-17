<?php
session_start();
if (!isset($_SESSION['email'])) {
    header('Location: index.html');
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
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <div class="welcome-container">
        <h2>Bem-vindo, <?php echo htmlspecialchars($userInfo['nome']); ?>!</h2>
        <p>Curso: <?php echo htmlspecialchars($userInfo['curso']); ?></p>
        <p>Email: <?php echo htmlspecialchars($email); ?></p>

        <!-- Adicione mais informações conforme necessário -->
        <?php if (!$verificado) : ?>
            <div class="alert">
                <p>Sua conta ainda não está verificada. Por favor, verifique seu e-mail.</p>
            </div>
        <?php endif; ?>
        <button onclick="window.location.href='perfil.php'">Perfil</button>
        <button onclick="logout()">Sair</button>
    </div>
    <script>
        function logout() {
            fetch('logout.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    window.location.href = 'index.html';
                }
            });
        }
    </script>
</body>

</html>