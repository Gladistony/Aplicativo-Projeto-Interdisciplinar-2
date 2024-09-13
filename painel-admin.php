<?php

require 'vendor/autoload.php';

use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth\CreateUser;

// Defina a senha esperada
$expectedPassword = 'duhadslgcaiudb42r3ffe1e';

// Função para verificar a senha
function isValidPassword($password)
{
    global $expectedPassword;
    return $password === $expectedPassword;
}

// Verifique a senha no início
if (!isset($_GET['senha']) || !isValidPassword($_GET['senha'])) {
    die('Acesso não autorizado.');
}

$json = '{
  "type": "service_account",
  "project_id": "monitoria-projeto-2",
  "private_key_id": "44af01275806adc07a452969a085eaa8aecd75d0",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDWlCcIMiaLZxP2\nNFEYcCqhTLrkfXlavPKwYsIYQi/3PKrfIpYGUZGWh9+9lOHA7RNoJOosX1R+LJFN\n2IHGdpw7be7OinbsQ+fH11FGBAM61YMGg0vzZ2fI6IIclqT3QBWUaxporOE15Ojb\nKXx5bpU/eMZK+UhCx/iHgj8AK/pyDQVozXRfxW9a2J720dDnEd4Uoc3I/3WMpKkj\nK1we0+75++ovbL4qmBmqMQ1l2R+Lw6P+Snr1zQXSfR2NvxOJh/d0xbroiyvkJ0wx\nQL5Gxrob4pPftv9yzdbjfpE3VgsGSkuLedQdp7qLzPMLlQQG+tvO3Pih5dWSFgdP\nUBIVUKzvAgMBAAECggEAITg6erhY40gH/RvIWkIzN1mLrYgHW5bY85m2ds74YgxQ\nX88Y7s19/pH2f4EnGhkZ4guk/U2c5RO9QxH7tV/ze/fe+rbRBm7U2UlqWa6RWXBo\non99KKefl6j3S7m+vFB9hsa2BfKNwyw3KIbZsGsATB1EhaLmHwCaZ1AwtLQaR8GX\npEZ4e+Ul7OqoDOUAFBDnSGVJCNA+64xvJU+aNomdWHyrS6CIPMV9Gh2nqeAK2UVY\ncW4WkrPv880iFlIOWwso3G2LZsTVUZqfLhN6h0bmg4jX9dCiHkxGGjzGk/VUxDAD\n6RiUinowroO4smcegOk7KzlWFVjqBeIdwhDigQLo4QKBgQD2vW32NpSrMIF0SbO0\nW+ZVXfy6ZRJ3vhqZwGkQCIyOJLnmubvsCGQLS9VC8Nr/9Wlh8iWEWaPf0QmXRInf\nXgWXXpG8XOggC70i6EHHD9NV5HtqVC0FQ/2al22Y/PP8L/Ys5jOqeizA7NR4CNPf\nXAFclos3U7YEQF4kCcFCQZ0WKQKBgQDeobtRFodDyQheg2iSGJf+92zfw5JdvhrF\nacEmCMJPRO7BMautUCG9vQIsd+1NBYSngmq0FFnuDGzD6lVU8X0hK2MuhzCxweja\nzBU0aFF10S5Ao/+owx1vJrOKp2LL72OcBMnhf/x8Js63g1blLzHpr5oJMsKUpGyO\nIrjVVH+dVwKBgFvAIQ23Sh1GUj0d0vc0XThNVNczEmT4ige2ZtsRcsLAoWhMlLa2\ngA07S7gyvB0F8wP6+Tx34NovbzOSxvoKimW5QtQacC7KbrB2UU9mcR21crcdSgh1\nOe6sdJK5LTkP1KjpiTjRaabr6i4giji6i78UM/yE4mA+V0NrZTPwFivRAoGAMyOX\ncYLpQ0rUX1F0HcsEbw7KtYOpBVt7rskiEuiEKc09wqb0NnVnqrvV2f0aR0zzMb8l\nX4QlPCcifMZBH6fxBEOBHtjy+IIASPIEFOu5eoS4SSTivxNCmZucNkdIzGuKx/XZ\nobDSgHoxlbnXpgF3R6SMj3xXcelq/iM/rdEhFzUCgYEAi9jkbp1xR5cHG/f7yAb1\nYNUZIuPjnsd1Vs0pmFHzV7mSmjZ6za3bTXg8P1Ouxill1uds5w/djEBL/RikKNCz\nIrnKRN627IRfkoZaKtJBFf3C9KHOP+jrggumfvqaGFU66VAyTD0SQxa/tx8+BNbR\nupM1dwkd43VhaRJjOVWkUTI=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-by4jf@monitoria-projeto-2.iam.gserviceaccount.com",
  "client_id": "118175920194139062299",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-by4jf%40monitoria-projeto-2.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}';


$factory = (new Factory)->withServiceAccount($json);
$auth = $factory->createAuth();

$users = $auth->listUsers($defaultMaxResults = 1000, $defaultBatchSize = 1000);

$successMessage = '';
$errorMessage = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['uid']) && isset($_POST['action'])) {
    $uid = $_POST['uid'];
    $action = $_POST['action'];
    if ($action === 'change_password' && isset($_POST['new_password'])) {
        $newPassword = $_POST['new_password'];
        try {
            $auth->changeUserPassword($uid, $newPassword);
            $user = $auth->getUser($uid);
            $successMessage = "Senha alterada com sucesso para o usuário com o displayName {$user->displayName}.";
        } catch (Exception $e) {
            $errorMessage = "Erro ao alterar a senha: " . $e->getMessage();
        }
    } elseif ($action === 'delete_user') {
        try {
            $user = $auth->getUser($uid);
            $auth->deleteUser($uid);
            $successMessage = "Usuário com o displayName {$user->displayName} deletado com sucesso.";
        } catch (\Kreait\Firebase\Exception\Auth\UserNotFound $e) {
            $errorMessage = "Erro ao deletar o usuário: " . $e->getMessage();
        } catch (\Kreait\Firebase\Exception\Auth\AuthError $e) {
            $errorMessage = "Erro ao deletar o usuário: " . $e->getMessage();
        }
    } elseif ($action === 'update_account_type' && isset($_POST['account_type'])) {
        $accountType = $_POST['account_type'];
        try {
            // Atualiza os custom claims com o tipo de conta
            $auth->setCustomUserClaims($uid, ['accountType' => $accountType]);
            $user = $auth->getUser($uid);
            $successMessage = "Tipo de conta atualizado com sucesso para o usuário com o displayName {$user->displayName}.";
        } catch (Exception $e) {
            $errorMessage = "Erro ao atualizar o tipo de conta: " . $e->getMessage();
        }
    }
}

?>

<!DOCTYPE html>
<html>

<head>
    <title>Lista de Usuários</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        .button {
            background-color: #4CAF50;
            /* Verde */
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 4px;
        }

        .button-red {
            background-color: #f44336;
            /* Vermelho */
        }

        .button-blue {
            background-color: #008CBA;
            /* Azul */
        }

        .button-green {
            background-color: #4CAF50;
            /* Verde */
        }
    </style>
    <script>
        function changePassword(uid, displayName) {
            const newPassword = prompt("Digite a nova senha para o usuário " + displayName + ":");
            if (newPassword) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '';

                const uidInput = document.createElement('input');
                uidInput.type = 'hidden';
                uidInput.name = 'uid';
                uidInput.value = uid;
                form.appendChild(uidInput);

                const actionInput = document.createElement('input');
                actionInput.type = 'hidden';
                actionInput.name = 'action';
                actionInput.value = 'change_password';
                form.appendChild(actionInput);

                const passwordInput = document.createElement('input');
                passwordInput.type = 'hidden';
                passwordInput.name = 'new_password';
                passwordInput.value = newPassword;
                form.appendChild(passwordInput);

                document.body.appendChild(form);
                form.submit();
            }
        }

        function deleteUser(uid, displayName) {
            if (confirm("Deseja realmente deletar o usuário " + displayName + "?")) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '';

                const uidInput = document.createElement('input');
                uidInput.type = 'hidden';
                uidInput.name = 'uid';
                uidInput.value = uid;
                form.appendChild(uidInput);

                const actionInput = document.createElement('input');
                actionInput.type = 'hidden';
                actionInput.name = 'action';
                actionInput.value = 'delete_user';
                form.appendChild(actionInput);

                document.body.appendChild(form);
                form.submit();
            }
        }

        function updateAccountType(uid, displayName) {
            const accountType = prompt("Digite o novo tipo de conta para o usuário " + displayName + " (Aluno, Monitor, Professor, Admin):");
            const validTypes = ["Aluno", "Monitor", "Professor", "Admin"];
            if (accountType && validTypes.includes(accountType)) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '';

                const uidInput = document.createElement('input');
                uidInput.type = 'hidden';
                uidInput.name = 'uid';
                uidInput.value = uid;
                form.appendChild(uidInput);

                const actionInput = document.createElement('input');
                actionInput.type = 'hidden';
                actionInput.name = 'action';
                actionInput.value = 'update_account_type';
                form.appendChild(actionInput);

                const typeInput = document.createElement('input');
                typeInput.type = 'hidden';
                typeInput.name = 'account_type';
                typeInput.value = accountType;
                form.appendChild(typeInput);

                document.body.appendChild(form);
                form.submit();
            } else if (accountType) {
                alert("Tipo de conta inválido. Os tipos válidos são: Aluno, Monitor, Professor, Admin.");
            }
        }

        function showAlert(message, type) {
            if (message) {
                if (type === 'success') {
                    alert(message);
                } else if (type === 'error') {
                    alert(message);
                }
            }
        }

        function logout() {
            // Redireciona para a URL especificada
            window.location.href = './Paginas/main-logado.php';
        }
    </script>
</head>

<body onload="showAlert('<?php echo $successMessage; ?>', 'success'); showAlert('<?php echo $errorMessage; ?>', 'error');">
    <h1>Lista de Usuários</h1>
    <button class="button button-red" onclick="logout()">Sair do Painel de Admin</button>
    <table>
        <tr>
            <th>UID</th>
            <th>Display Name</th>
            <th>Email</th>
            <th>Data de Criação</th>
            <th>Último Login</th>
            <th>Tipo de Conta</th>
            <th>Mudar Senha</th>
            <th>Deletar Usuário</th>
            <th>Atualizar Tipo de Conta</th>
        </tr>
        <?php foreach ($users as $user): ?>
            <tr>
                <td><?php echo $user->uid; ?></td>
                <td><?php echo $user->displayName ? $user->displayName : 'Não definido'; ?></td>
                <td><?php echo $user->email; ?></td>
                <td><?php echo $user->metadata->createdAt->format('Y-m-d H:i:s'); ?></td>
                <td><?php echo $user->metadata->lastLoginAt ? $user->metadata->lastLoginAt->format('Y-m-d H:i:s') : 'Nunca'; ?></td>
                <td><?php echo $user->customClaims['accountType'] ? $user->customClaims['accountType'] : 'Não definido'; ?></td>
                <td><button class="button" onclick="changePassword('<?php echo $user->uid; ?>', '<?php echo addslashes($user->displayName); ?>')">Mudar Senha</button></td>
                <td><button class="button button-red" onclick="deleteUser('<?php echo $user->uid; ?>', '<?php echo addslashes($user->displayName); ?>')">Deletar Usuário</button></td>
                <td><button class="button button-blue" onclick="updateAccountType('<?php echo $user->uid; ?>', '<?php echo addslashes($user->displayName); ?>')">Atualizar Tipo</button></td>
            </tr>
        <?php endforeach; ?>
    </table>
</body>

</html>