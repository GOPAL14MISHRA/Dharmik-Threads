<?php
require_once 'helper.php';

$data = getRequestData();
$email = strtolower(trim($data['email'] ?? ''));

if (!$email) {
    sendResponse(['error' => 'Missing email'], 400);
}

$newsletter = getJsonFile('newsletter.json');

$newsletter[$email] = [
    'email' => $email,
    'subscribedAt' => date('c'),
];

saveJsonFile('newsletter.json', $newsletter);

sendResponse(['ok' => true, 'email' => $email]);
?>
