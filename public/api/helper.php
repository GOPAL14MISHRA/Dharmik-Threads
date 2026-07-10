<?php
// Enable CORS and set JSON header
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Ensure data directory exists
$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0777, true);
}

function getJsonFile($filename) {
    global $dataDir;
    $filepath = $dataDir . '/' . $filename;
    if (!file_exists($filepath)) {
        return [];
    }
    $json = file_get_contents($filepath);
    return json_decode($json, true) ?: [];
}

function saveJsonFile($filename, $data) {
    global $dataDir;
    $filepath = $dataDir . '/' . $filename;
    file_put_contents($filepath, json_encode($data, JSON_PRETTY_PRINT));
}

function getRequestData() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?: [];
}

function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}
?>
