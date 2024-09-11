<?php
session_start();

// Verificar se as variáveis de sessão estão definidas
$response = array(
    'email' => isset($_SESSION['email']) ? $_SESSION['email'] : null,
    'userInfo' => isset($_SESSION['userInfo']) ? $_SESSION['userInfo'] : null,
    'verificado' => isset($_SESSION['verificado']) ? $_SESSION['verificado'] : null,
    'id' => isset($_SESSION['id']) ? $_SESSION['id'] : null,
    'infoConfig' => isset($_SESSION['infoConfig']) ? $_SESSION['infoConfig'] : null,
    'forum' => isset($_SESSION['forum']) ? $_SESSION['forum'] : null
);

echo json_encode($response);
