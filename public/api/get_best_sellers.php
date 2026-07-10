<?php
require_once 'helper.php';

$productsData = getJsonFile('products.json');
$products = array_values($productsData);

$bestSellers = array_filter($products, function($p) {
    return !empty($p['isBestSeller']);
});

sendResponse(array_values($bestSellers));
?>
