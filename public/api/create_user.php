<?php
require_once 'helper.php';

$data = getRequestData();
$uid = $data['uid'] ?? null;

if (!$uid) {
    sendResponse(['error' => 'Missing uid'], 400);
}

$users = getJsonFile('users.json');
$users[$uid] = $data;

saveJsonFile('users.json', $users);

sendResponse(['ok' => true, 'user' => $data]);
?>
