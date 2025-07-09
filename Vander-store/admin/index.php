<?php
// Inclua a conexão com banco, se quiser puxar dados reais depois
// include_once '../config/database.php';
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Painel Admin - Vander-Store</title>
    <link rel="stylesheet" href="../css/admin.css" />
</head>
<body>
    <header class="admin-header">
        <h1>Painel Administrativo</h1>
        <nav>
            <a href="#">Dashboard</a>
            <a href="#">Produtos</a>
            <a href="#">Categorias</a>
            <a href="#">Pedidos</a>
            <a href="#">Usuários</a>
        </nav>
    </header>

    <main class="admin-main">
        <section class="dashboard-cards">
            <div class="card">
                <h3>Produtos</h3>
                <p>120</p>
            </div>
            <div class="card">
                <h3>Categorias</h3>
                <p>8</p>
            </div>
            <div class="card">
                <h3>Pedidos</h3>
                <p>34</p>
            </div>
            <div class="card">
                <h3>Usuários</h3>
                <p>56</p>
            </div>
        </section>

        <section class="recent-orders">
            <h2>Pedidos Recentes</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Data</th>
                        <th>Status</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1001</td>
                        <td>João Silva</td>
                        <td>2025-07-01</td>
                        <td><span class="status delivered">Entregue</span></td>
                        <td>R$ 250,00</td>
                    </tr>
                    <tr>
                        <td>1002</td>
                        <td>Maria Souza</td>
                        <td>2025-07-03</td>
                        <td><span class="status pending">Pendente</span></td>
                        <td>R$ 150,00</td>
                    </tr>
                    <tr>
                        <td>1003</td>
                        <td>Carlos Lima</td>
                        <td>2025-07-05</td>
                        <td><span class="status processing">Processando</span></td>
                        <td>R$ 300,00</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </main>

    <footer class="admin-footer">
        <p>© 2025 Vander-Store. Todos os direitos reservados.</p>
    </footer>
</body>
</html>
