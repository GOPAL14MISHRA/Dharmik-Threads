<?php
require_once 'helper.php';

$uid = $_GET['uid'] ?? null;

if (!$uid) {
    sendResponse(['error' => 'Missing uid'], 400);
}

$carts = getJsonFile('carts.json');

if (isset($carts[$uid])) {
    sendResponse($carts[$uid]);
} else {
    sendResponse(null);
}
?>
