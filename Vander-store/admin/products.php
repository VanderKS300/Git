<?php
require_once '../config/database.php';

$db = (new Database())->getConnection();
$stmt = $db->query("SELECT * FROM products ORDER BY created_at DESC");
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Produtos</title>
    <link rel="stylesheet" href="assets/admin.css">
</head>
<body>
    <h1>Produtos</h1>
    <a href="add_product.php">+ Adicionar Novo Produto</a>
    <table>
        <tr>
            <th>ID</th><th>Nome</th><th>Preço</th><th>Ações</th>
        </tr>
        <?php foreach ($products as $prod): ?>
        <tr>
            <td><?= $prod['id'] ?></td>
            <td><?= $prod['name'] ?></td>
            <td>R$ <?= number_format($prod['price'], 2, ',', '.') ?></td>
            <td>
                <a href="edit_product.php?id=<?= $prod['id'] ?>">Editar</a>
                <a href="delete_product.php?id=<?= $prod['id'] ?>" onclick="return confirm('Confirmar exclusão?')">Excluir</a>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>
</body>
</html>
