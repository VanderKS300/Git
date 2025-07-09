<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: login.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Painel Admin</title>
    <link rel="stylesheet" href="painel.css">
</head>
<body>
    <div class="admin-panel">
        <h1>Bem-vindo ao Painel de Administração</h1>
        <p>Você está logado como administrador.</p>
        <a href="logout.php" class="logout-btn">Sair</a>
    </div>
</body>
</html>
