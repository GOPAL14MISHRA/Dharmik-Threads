<?php
require_once 'helper.php';

$data = getRequestData();
$uid = $data['uid'] ?? null;
$address = $data['address'] ?? null;

if (!$uid || !$address) {
    sendResponse(['error' => 'Missing uid or address'], 400);
}

$users = getJsonFile('users.json');

if (!isset($users[$uid])) {
    sendResponse(['error' => 'User not found'], 404);
}

if (!isset($users[$uid]['addresses']) || !is_array($users[$uid]['addresses'])) {
    $users[$uid]['addresses'] = [];
}

$users[$uid]['addresses'][] = $address;
$users[$uid]['updatedAt'] = date('c');

saveJsonFile('users.json', $users);

sendResponse(['ok' => true, 'user' => $users[$uid]]);
?>
