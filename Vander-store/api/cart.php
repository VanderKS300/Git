<?php
session_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include_once '../config/database.php';
include_once '../classes/Cart.php';

$database = new Database();
$db = $database->getConnection();

$cart = new Cart($db);

// Usar session_id como identificador do carrinho
$cart->session_id = session_id();

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

switch($method) {
    case 'GET':
        // Buscar itens do carrinho
        $stmt = $cart->getItems();
        $cart_items = array();
        
        while ($row = $stmt->fetch()) {
            $cart_item = array(
                "id" => $row['id'],
                "product_id" => $row['product_id'],
                "name" => $row['name'],
                "price" => floatval($row['price']),
                "image_url" => $row['image_url'],
                "quantity" => $row['quantity'],
                "subtotal" => floatval($row['price']) * $row['quantity']
            );
            array_push($cart_items, $cart_item);
        }
        
        $response = array(
            "items" => $cart_items,
            "count" => $cart->count(),
            "total" => floatval($cart->getTotal())
        );
        
        echo json_encode($response);
        break;
        
    case 'POST':
        if (strpos($request_uri, '/add') !== false) {
            // Adicionar item ao carrinho
            $data = json_decode(file_get_contents("php://input"));
            
            if (!empty($data->product_id) && !empty($data->quantity)) {
                $cart->product_id = $data->product_id;
                $cart->quantity = $data->quantity;
                
                if ($cart->add()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Produto adicionado ao carrinho"));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Não foi possível adicionar o produto"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Dados incompletos"));
            }
        }
        break;
        
    case 'PUT':
        if (strpos($request_uri, '/update') !== false) {
            // Atualizar quantidade do item
            $data = json_decode(file_get_contents("php://input"));
            
            if (!empty($data->id) && isset($data->quantity)) {
                $cart->id = $data->id;
                $cart->quantity = $data->quantity;
                
                if ($cart->updateQuantity()) {
                    echo json_encode(array("message" => "Quantidade atualizada"));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Não foi possível atualizar a quantidade"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Dados incompletos"));
            }
        }
        break;
        
    case 'DELETE':
        if (strpos($request_uri, '/remove') !== false) {
            // Remover item do carrinho
            $data = json_decode(file_get_contents("php://input"));
            
            if (!empty($data->id)) {
                $cart->id = $data->id;
                
                if ($cart->remove()) {
                    echo json_encode(array("message" => "Item removido do carrinho"));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Não foi possível remover o item"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "ID do item não fornecido"));
            }
        } elseif (strpos($request_uri, '/clear') !== false) {
            // Limpar carrinho
            if ($cart->clear()) {
                echo json_encode(array("message" => "Carrinho limpo"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Não foi possível limpar o carrinho"));
            }
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método não permitido"));
        break;
}
?>

