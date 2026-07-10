<?php
require_once 'helper.php';

$uid = $_GET['uid'] ?? null;

if (!$uid) {
    sendResponse(['error' => 'Missing uid'], 400);
}

$ordersData = getJsonFile('orders.json');
$userOrders = [];

foreach ($ordersData as $id => $order) {
    if (isset($order['userId']) && $order['userId'] === $uid) {
        $userOrders[] = $order;
    }
}

usort($userOrders, function($a, $b) {
    $timeA = strtotime($a['placedAt'] ?? $a['createdAt'] ?? '');
    $timeB = strtotime($b['placedAt'] ?? $b['createdAt'] ?? '');
    return $timeB - $timeA;
});

sendResponse($userOrders);
?>
