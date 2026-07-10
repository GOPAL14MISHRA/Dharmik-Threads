<?php
require_once 'helper.php';

$uid = $_GET['uid'] ?? null;

if (!$uid) {
    sendResponse(['error' => 'Missing uid'], 400);
}

$users = getJsonFile('users.json');

if (isset($users[$uid])) {
    sendResponse($users[$uid]);
} else {
    // Return empty or null if not found, frontend expects null if not exists
    sendResponse(null);
}
?>
