<?php
require_once 'helper.php';

$data = getRequestData();
$userId = $data['userId'] ?? null;
$items = $data['items'] ?? [];

if (!$userId || empty($items)) {
    sendResponse(['error' => 'Missing userId or items'], 400);
}

function generateOrderId() {
    return 'DT' . substr(time(), -8) . str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);
}

function generateTrackingNumber() {
    return 'TRK' . rand(100000000, 999999999);
}

$orderId = generateOrderId();
$trackingNumber = generateTrackingNumber();
$placedAt = date('c');

$order = [
    'orderId' => $orderId,
    'userId' => $userId,
    'items' => $items,
    'shippingAddress' => $data['shippingAddress'] ?? [],
    'paymentMethod' => $data['paymentMethod'] ?? '',
    'paymentStatus' => ($data['paymentMethod'] ?? '') === 'cod' ? 'cod_pending' : 'pending',
    'orderStatus' => 'placed',
    'trackingNumber' => $trackingNumber,
    'subtotal' => $data['subtotal'] ?? 0,
    'discount' => $data['discount'] ?? 0,
    'tax' => $data['tax'] ?? 0,
    'total' => $data['total'] ?? 0,
    'createdAt' => $placedAt,
    'placedAt' => $placedAt,
];

$orders = getJsonFile('orders.json');
$orders[$orderId] = $order;
saveJsonFile('orders.json', $orders);

$carts = getJsonFile('carts.json');
if (isset($carts[$userId])) {
    $carts[$userId]['items'] = [];
    $carts[$userId]['coupon'] = null;
    $carts[$userId]['discount'] = 0;
    $carts[$userId]['updatedAt'] = $placedAt;
    saveJsonFile('carts.json', $carts);
}

// We could update product stock here but since this is mock JSON, we can skip complex stock mutation for now or do a simple one.
$products = getJsonFile('products.json');
$productsUpdated = false;
foreach ($items as $item) {
    $pid = $item['productId'];
    if (isset($products[$pid])) {
        if (isset($products[$pid]['variants'])) {
            foreach ($products[$pid]['variants'] as &$v) {
                if ($v['variantId'] === $item['variantId'] && isset($v['sizes'])) {
                    foreach ($v['sizes'] as &$s) {
                        if ($s['size'] === $item['size']) {
                            $s['stock'] = max(0, $s['stock'] - $item['quantity']);
                            $productsUpdated = true;
                        }
                    }
                }
            }
        }
    }
}
if ($productsUpdated) {
    saveJsonFile('products.json', $products);
}

sendResponse($order);
?>
