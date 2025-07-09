<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include_once '../config/database.php';
include_once '../classes/Category.php';

$database = new Database();
$db = $database->getConnection();

$category = new Category($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $stmt = $category->read();
        $categories_arr = array();
        
        while ($row = $stmt->fetch()) {
            $category_item = array(
                "id" => $row['id'],
                "name" => $row['name'],
                "slug" => $row['slug'],
                "description" => $row['description']
            );
            array_push($categories_arr, $category_item);
        }
        
        echo json_encode($categories_arr);
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método não permitido"));
        break;
}
?>

