<?php
session_start();
if (!isset($_SESSION['email'])) {
    header('Location: index.html');
    exit();
}

$email = $_SESSION['email'];
$userInfo = $_SESSION['userInfo'];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil do Usuário</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <div class="profile-container">
        <h2>Perfil do Usuário</h2>
        <form id="profileForm">
            <label for="nome">Nome:</label>
            <input type="text" id="nome" value="<?php echo htmlspecialchars($userInfo['nome']); ?>" disabled>

            <label for="email">Email:</label>
            <input type="email" id="email" value="<?php echo htmlspecialchars($email); ?>" disabled>

            <label for="curso">Curso:</label>
            <input type="text" id="curso" value="<?php echo htmlspecialchars($userInfo['curso']); ?>">

            <!-- Adicione mais campos conforme necessário -->

            <button type="button" onclick="enableEditing()">Editar</button>
            <button type="submit" id="saveButton" style="display: none;">Salvar</button>
        </form>
    </div>
    <script>
        function enableEditing() {
            document.getElementById('curso').disabled = false;
            // Habilitar outros campos conforme necessário
            document.getElementById('saveButton').style.display = 'block';
        }

        document.getElementById('profileForm').addEventListener('submit', async function(event) {
            event.preventDefault();

            const curso = document.getElementById('curso').value;
            // Obter valores de outros campos conforme necessário

            const response = await fetch('update-profile.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    curso: curso /* Adicione outros campos aqui */
                })
            });

            const result = await response.json();
            if (result.status === 'success') {
                alert('Perfil atualizado com sucesso!');
                window.location.reload();
            } else {
                alert('Erro ao atualizar o perfil: ' + result.message);
            }
        });
    </script>
</body>

</html>