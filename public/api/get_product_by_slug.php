<?php
require_once 'helper.php';

$slug = $_GET['slug'] ?? null;

if (!$slug) {
    sendResponse(['error' => 'Missing slug'], 400);
}

$productsData = getJsonFile('products.json');

foreach ($productsData as $p) {
    if (isset($p['slug']) && $p['slug'] === $slug) {
        sendResponse($p);
    }
}

sendResponse(null);
?>
