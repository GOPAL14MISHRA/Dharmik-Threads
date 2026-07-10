<?php
require_once 'helper.php';

$coupons = getJsonFile('coupons.json');
$publicCoupons = [];

foreach ($coupons as $code => $data) {
    if (!isset($data['active']) || $data['active'] === false) continue;
    if (isset($data['isPublic']) && $data['isPublic'] === false) continue;

    $publicCoupons[] = [
        'code' => $code,
        'description' => $data['description'] ?? '',
        'discountPct' => $data['discountValue'] ?? $data['discountPct'] ?? 10,
        'expires' => $data['expiryDate'] ?? $data['expires'] ?? '',
        'uses' => $data['uses'] ?? 0,
        'active' => true,
        'isPublic' => true,
    ];
}

sendResponse($publicCoupons);
?>
