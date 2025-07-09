<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include_once '../config/database.php';
include_once '../classes/Product.php';

$database = new Database();
$db = $database->getConnection();

$product = new Product($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Verificar se é uma rota específica
        $request_uri = $_SERVER['REQUEST_URI'];
        
        if (strpos($request_uri, '/featured') !== false) {
            // Produtos em destaque
            $stmt = $product->getFeatured();
            $products_arr = array();
            
            while ($row = $stmt->fetch()) {
                $product_item = array(
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "slug" => $row['slug'],
                    "description" => $row['description'],
                    "price" => floatval($row['price']),
                    "original_price" => $row['original_price'] ? floatval($row['original_price']) : null,
                    "image_url" => $row['image_url'],
                    "category_id" => $row['category_id'],
                    "category_name" => $row['category_name'],
                    "is_featured" => (bool)$row['is_featured'],
                    "is_on_sale" => (bool)$row['is_on_sale'],
                    "stock_quantity" => $row['stock_quantity']
                );
                array_push($products_arr, $product_item);
            }
            
            echo json_encode($products_arr);
            
        } elseif (strpos($request_uri, '/on-sale') !== false) {
            // Produtos em promoção
            $stmt = $product->getOnSale();
            $products_arr = array();
            
            while ($row = $stmt->fetch()) {
                $product_item = array(
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "slug" => $row['slug'],
                    "description" => $row['description'],
                    "price" => floatval($row['price']),
                    "original_price" => $row['original_price'] ? floatval($row['original_price']) : null,
                    "image_url" => $row['image_url'],
                    "category_id" => $row['category_id'],
                    "category_name" => $row['category_name'],
                    "is_featured" => (bool)$row['is_featured'],
                    "is_on_sale" => (bool)$row['is_on_sale'],
                    "stock_quantity" => $row['stock_quantity']
                );
                array_push($products_arr, $product_item);
            }
            
            echo json_encode($products_arr);
            
        } else {
            // Lista geral de produtos com paginação
            $page = isset($_GET['page']) ? $_GET['page'] : 1;
            $per_page = isset($_GET['per_page']) ? $_GET['per_page'] : 12;
            $category_id = isset($_GET['category_id']) ? $_GET['category_id'] : null;
            $search = isset($_GET['search']) ? $_GET['search'] : null;
            
            $stmt = $product->read($page, $per_page, $category_id, $search);
            $total = $product->count($category_id, $search);
            
            $products_arr = array();
            
            while ($row = $stmt->fetch()) {
                $product_item = array(
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "slug" => $row['slug'],
                    "description" => $row['description'],
                    "price" => floatval($row['price']),
                    "original_price" => $row['original_price'] ? floatval($row['original_price']) : null,
                    "image_url" => $row['image_url'],
                    "category_id" => $row['category_id'],
                    "category_name" => $row['category_name'],
                    "is_featured" => (bool)$row['is_featured'],
                    "is_on_sale" => (bool)$row['is_on_sale'],
                    "stock_quantity" => $row['stock_quantity']
                );
                array_push($products_arr, $product_item);
            }
            
            $response = array(
                "products" => $products_arr,
                "pagination" => array(
                    "page" => intval($page),
                    "per_page" => intval($per_page),
                    "total" => intval($total),
                    "total_pages" => ceil($total / $per_page)
                )
            );
            
            echo json_encode($response);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método não permitido"));
        break;
}
?>

