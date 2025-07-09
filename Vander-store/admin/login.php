<?php
session_start();

// Se já estiver logado, redireciona
if (isset($_SESSION['admin_logged_in'])) {
    header('Location: painel.php');
    exit();
}

// Verifica envio do formulário
$error = '';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST['usuario'];
    $senha = $_POST['senha'];

    // Altere aqui para o login/senha que você quiser
    if ($usuario === 'admin' && $senha === '1234') {
        $_SESSION['admin_logged_in'] = true;
        header('Location: painel.php');
        exit();
    } else {
        $error = "Usuário ou senha incorretos.";
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Login Admin</title>
    <link rel="stylesheet" href="login.css">
</head>
<body>
    <div class="login-container">
        <h2>Login do Administrador</h2>
        <?php if ($error): ?>
            <p class="error"><?= $error ?></p>
        <?php endif; ?>
        <form method="post">
            <input type="text" name="usuario" placeholder="Usuário" required>
            <input type="password" name="senha" placeholder="Senha" required>
            <button type="submit">Entrar</button>
        </form>
    </div>
</body>
</html>
