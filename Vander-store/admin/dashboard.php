<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: index.php");
    exit();
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body>
    <h1>Bem-vindo ao Painel Admin</h1>
    <ul>
        <li><a href="products.php">Gerenciar Produtos</a></li>
        <li><a href="categories.php">Gerenciar Categorias</a></li>
        <li><a href="logout.php">Sair</a></li>
    </ul>
</body>
</html>
