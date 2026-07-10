<?php
require_once 'helper.php';

$category = $_GET['category'] ?? null;
$collection = $_GET['collection'] ?? null;
$q = $_GET['q'] ?? null;

$productsData = getJsonFile('products.json');
// products.json should be an array of products or an object with ids as keys
$products = array_values($productsData);

if ($category) {
    $products = array_filter($products, function($p) use ($category) {
        return isset($p['category']) && $p['category'] === $category;
    });
}

if ($collection) {
    $products = array_filter($products, function($p) use ($collection) {
        return isset($p['collection']) && $p['collection'] === $collection;
    });
}

if ($q) {
    $q = strtolower($q);
    $products = array_filter($products, function($p) use ($q) {
        $title = strtolower($p['title'] ?? '');
        $desc = strtolower($p['description'] ?? '');
        return strpos($title, $q) !== false || strpos($desc, $q) !== false;
    });
}

sendResponse(array_values($products));
?>
