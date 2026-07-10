<?php
require_once 'helper.php';

$data = getRequestData();
$code = strtoupper($data['code'] ?? '');
$subtotal = $data['subtotal'] ?? 0;

if (!$code) {
    sendResponse(['valid' => false, 'error' => 'not_found']);
}

$coupons = getJsonFile('coupons.json');
$coupon = null;

foreach ($coupons as $c) {
    if (strtoupper($c['code']) === $code) {
        $coupon = $c;
        break;
    }
}

if (!$coupon) {
    sendResponse(['valid' => false, 'error' => 'not_found']);
}

$now = time();
$expiry = strtotime($coupon['expiryDate'] ?? '2099-01-01');

if (empty($coupon['active']) || $expiry < $now) {
    sendResponse(['valid' => false, 'error' => 'expired']);
}

if ($subtotal < ($coupon['minOrderAmount'] ?? 0)) {
    sendResponse(['valid' => false, 'error' => 'min_amount']);
}

$discount = $coupon['discountType'] === 'percent'
    ? round($subtotal * (($coupon['discountValue'] ?? 0) / 100))
    : ($coupon['discountValue'] ?? 0);

sendResponse([
    'valid' => true,
    'code' => $coupon['code'],
    'discount' => $discount,
    'discountType' => $coupon['discountType'],
    'discountValue' => $coupon['discountValue'],
]);
?>
