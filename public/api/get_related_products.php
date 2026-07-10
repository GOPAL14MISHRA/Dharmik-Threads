<?php
require_once 'helper.php';

$slug = $_GET['slug'] ?? null;

$productsData = getJsonFile('products.json');
$products = array_values($productsData);

$related = [];
foreach ($products as $p) {
    if ($slug && isset($p['slug']) && $p['slug'] === $slug) {
        continue;
    }
    $related[] = $p;
    if (count($related) >= 4) {
        break;
    }
}

sendResponse($related);
?>
