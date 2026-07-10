<?php
require_once 'helper.php';

$productsData = getJsonFile('products.json');
$products = array_values($productsData);

$newArrivals = array_filter($products, function($p) {
    return !empty($p['isNew']);
});

sendResponse(array_values($newArrivals));
?>
