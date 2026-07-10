<?php
require_once 'helper.php';

$data = getRequestData();
$uid = $data['userId'] ?? null;

if (!$uid) {
    sendResponse(['error' => 'Missing userId'], 400);
}

$carts = getJsonFile('carts.json');
$data['updatedAt'] = date('c');
$carts[$uid] = $data;

saveJsonFile('carts.json', $carts);

sendResponse($data);
?>
