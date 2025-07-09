<?php
class Cart {
    private $conn;
    private $table_name = "cart_items";

    public $id;
    public $session_id;
    public $product_id;
    public $quantity;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Adicionar item ao carrinho
    public function add() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET session_id=:session_id, product_id=:product_id, quantity=:quantity
                  ON DUPLICATE KEY UPDATE quantity = quantity + :quantity";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':session_id', $this->session_id);
        $stmt->bindParam(':product_id', $this->product_id);
        $stmt->bindParam(':quantity', $this->quantity);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Buscar itens do carrinho
    public function getItems() {
        $query = "SELECT ci.*, p.name, p.price, p.image_url 
                  FROM " . $this->table_name . " ci
                  LEFT JOIN products p ON ci.product_id = p.id 
                  WHERE ci.session_id = :session_id 
                  ORDER BY ci.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $this->session_id);
        $stmt->execute();

        return $stmt;
    }

    // Atualizar quantidade do item
    public function updateQuantity() {
        $query = "UPDATE " . $this->table_name . " 
                  SET quantity = :quantity 
                  WHERE id = :id AND session_id = :session_id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':quantity', $this->quantity);
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':session_id', $this->session_id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Remover item do carrinho
    public function remove() {
        $query = "DELETE FROM " . $this->table_name . " 
                  WHERE id = :id AND session_id = :session_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':session_id', $this->session_id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Limpar carrinho
    public function clear() {
        $query = "DELETE FROM " . $this->table_name . " WHERE session_id = :session_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $this->session_id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Contar itens no carrinho
    public function count() {
        $query = "SELECT SUM(quantity) as total FROM " . $this->table_name . " WHERE session_id = :session_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $this->session_id);
        $stmt->execute();

        $row = $stmt->fetch();
        return $row['total'] ? $row['total'] : 0;
    }

    // Calcular total do carrinho
    public function getTotal() {
        $query = "SELECT SUM(ci.quantity * p.price) as total 
                  FROM " . $this->table_name . " ci
                  LEFT JOIN products p ON ci.product_id = p.id 
                  WHERE ci.session_id = :session_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $this->session_id);
        $stmt->execute();

        $row = $stmt->fetch();
        return $row['total'] ? $row['total'] : 0;
    }
}
?>

