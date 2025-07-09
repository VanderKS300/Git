<?php
class Product {
    private $conn;
    private $table_name = "products";

    public $id;
    public $name;
    public $slug;
    public $description;
    public $price;
    public $original_price;
    public $image_url;
    public $category_id;
    public $is_featured;
    public $is_on_sale;
    public $stock_quantity;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Buscar todos os produtos com paginação
    public function read($page = 1, $per_page = 12, $category_id = null, $search = null) {
        $offset = ($page - 1) * $per_page;
        
        $query = "SELECT p.*, c.name as category_name 
                  FROM " . $this->table_name . " p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE 1=1";
        
        $params = [];
        
        if ($category_id) {
            $query .= " AND p.category_id = :category_id";
            $params[':category_id'] = $category_id;
        }
        
        if ($search) {
            $query .= " AND p.name LIKE :search";
            $params[':search'] = '%' . $search . '%';
        }
        
        $query .= " ORDER BY p.created_at DESC LIMIT :offset, :per_page";
        
        $stmt = $this->conn->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->bindValue(':per_page', $per_page, PDO::PARAM_INT);
        
        $stmt->execute();
        return $stmt;
    }

    // Contar total de produtos
    public function count($category_id = null, $search = null) {
        $query = "SELECT COUNT(*) as total FROM " . $this->table_name . " WHERE 1=1";
        
        $params = [];
        
        if ($category_id) {
            $query .= " AND category_id = :category_id";
            $params[':category_id'] = $category_id;
        }
        
        if ($search) {
            $query .= " AND name LIKE :search";
            $params[':search'] = '%' . $search . '%';
        }
        
        $stmt = $this->conn->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->execute();
        $row = $stmt->fetch();
        return $row['total'];
    }

    // Buscar produtos em destaque
    public function getFeatured($limit = 6) {
        $query = "SELECT p.*, c.name as category_name 
                  FROM " . $this->table_name . " p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE p.is_featured = 1 
                  ORDER BY p.created_at DESC 
                  LIMIT :limit";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt;
    }

    // Buscar produtos em promoção
    public function getOnSale($limit = 6) {
        $query = "SELECT p.*, c.name as category_name 
                  FROM " . $this->table_name . " p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE p.is_on_sale = 1 
                  ORDER BY p.created_at DESC 
                  LIMIT :limit";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt;
    }

    // Buscar produto por ID
    public function readOne() {
        $query = "SELECT p.*, c.name as category_name 
                  FROM " . $this->table_name . " p 
                  LEFT JOIN categories c ON p.category_id = c.id 
                  WHERE p.id = :id 
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();

        $row = $stmt->fetch();

        if ($row) {
            $this->name = $row['name'];
            $this->slug = $row['slug'];
            $this->description = $row['description'];
            $this->price = $row['price'];
            $this->original_price = $row['original_price'];
            $this->image_url = $row['image_url'];
            $this->category_id = $row['category_id'];
            $this->is_featured = $row['is_featured'];
            $this->is_on_sale = $row['is_on_sale'];
            $this->stock_quantity = $row['stock_quantity'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }

        return false;
    }
}
?>

