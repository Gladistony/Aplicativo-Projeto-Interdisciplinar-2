<?php
session_start();

// Definindo o nome do usuário para exibição
$userInfo = $_SESSION['userInfo'];
$nome = $userInfo['nome'];
// Definições Gerais
$infoGeral = $_SESSION['infoConfig'];
$boas_vindas = $infoGeral['MsgBoasVindas'];
$periodo = $infoGeral['Periodo'];
$avisos = $infoGeral['Avisos'];

// Obtendo a data atual
$dataAtual = date('d/m/Y H:i:s');
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <title>Bem-vindo</title>
    <style>
        body>div#conteudo_principal {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f0f0f0;
            margin: 0;
        }

        .container>div#conteudo_principal {
            text-align: center;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1>div#conteudo_principal {
            color: #333;
        }

        p>div#conteudo_principal {
            color: #666;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Bem-vindo, <?php echo $nome; ?>!</h1>
        <p><?php echo $boas_vindas; ?></p>
        <p>Periodo: <?php echo $periodo; ?></p>
        <?php
        for ($i = 0; $i < count($avisos); $i++) {
            echo "<p>{$avisos[$i]}</p>";
        }
        ?>
        <p>Data e hora atual: <?php echo $dataAtual; ?></p>
    </div>
</body>

</html>