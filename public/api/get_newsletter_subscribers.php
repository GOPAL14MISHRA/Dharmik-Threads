<?php
require_once 'helper.php';

$newsletter = getJsonFile('newsletter.json');

$subscribers = [];
foreach ($newsletter as $email => $data) {
    $subscribers[] = ['id' => $email, 'email' => $email, 'subscribedAt' => $data['subscribedAt'] ?? ''];
}

sendResponse($subscribers);
?>
