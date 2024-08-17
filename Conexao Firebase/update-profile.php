<?php
session_start();
if (!isset($_SESSION['email'])) {
    header('Location: index.html');
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$email = $_SESSION['email'];
$userInfo = $_SESSION['userInfo'];

// Atualizar informações no Firestore
require 'firebase-config.php';

use Google\Cloud\Firestore\FirestoreClient;

try {
    $db = new FirestoreClient([
        'projectId' => 'seu-projeto-id'
    ]);

    $docRef = $db->collection('InforConta')->document($userInfo['uid']);
    $docRef->update([
        ['path' => 'curso', 'value' => $data['curso']],
        // Adicione outros campos aqui
    ]);

    // Atualizar informações na sessão
    $_SESSION['userInfo']['curso'] = $data['curso'];
    // Atualize outros campos na sessão

    echo json_encode(['status' => 'success']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
