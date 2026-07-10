<?php
require_once 'helper.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    sendResponse(['error' => 'Missing id'], 400);
}

$ordersData = getJsonFile('orders.json');

if (isset($ordersData[$id])) {
    $order = $ordersData[$id];
    sendResponse([
        'status' => $order['orderStatus'] ?? '',
        'tracking' => $order['trackingNumber'] ?? '',
    ]);
} else {
    sendResponse(null);
}
?>
