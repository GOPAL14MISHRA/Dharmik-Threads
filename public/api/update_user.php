<?php
require_once 'helper.php';

$data = getRequestData();
$uid = $data['uid'] ?? null;
$patch = $data['patch'] ?? [];

if (!$uid) {
    sendResponse(['error' => 'Missing uid'], 400);
}

$users = getJsonFile('users.json');

if (!isset($users[$uid])) {
    sendResponse(['error' => 'User not found'], 404);
}

foreach ($patch as $key => $value) {
    $users[$uid][$key] = $value;
}
$users[$uid]['updatedAt'] = date('c');

saveJsonFile('users.json', $users);

sendResponse(['ok' => true, 'user' => $users[$uid]]);
?>
