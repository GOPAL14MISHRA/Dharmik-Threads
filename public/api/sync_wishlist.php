<?php
require_once 'helper.php';

$data = getRequestData();
$userId = $data['userId'] ?? null;
$productIds = $data['productIds'] ?? [];

if (!$userId) {
    sendResponse(['error' => 'Missing userId'], 400);
}

$wishlists = getJsonFile('wishlists.json');
$wishlists[$userId] = [
    'userId' => $userId,
    'productIds' => $productIds,
    'updatedAt' => date('c'),
];

saveJsonFile('wishlists.json', $wishlists);

sendResponse(['userId' => $userId, 'productIds' => $productIds]);
?>
