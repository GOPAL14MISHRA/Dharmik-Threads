<?php
require_once 'helper.php';

$uid = $_GET['uid'] ?? null;

if (!$uid) {
    sendResponse(['error' => 'Missing uid'], 400);
}

$wishlists = getJsonFile('wishlists.json');

if (isset($wishlists[$uid])) {
    $data = $wishlists[$uid];
    $productIds = is_array($data['productIds'] ?? null) ? $data['productIds'] : [];
    sendResponse($productIds);
} else {
    sendResponse([]);
}
?>
