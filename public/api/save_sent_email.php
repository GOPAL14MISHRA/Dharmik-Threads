<?php
require_once 'helper.php';

$data = getRequestData();
$id = $data['id'] ?? null;
$to = $data['to'] ?? null;

if (!$id || !$to) {
    sendResponse(['error' => 'Missing id or to'], 400);
}

$sentEmails = getJsonFile('sent_emails.json');

$sentEmails[$id] = $data;
saveJsonFile('sent_emails.json', $sentEmails);

sendResponse(['ok' => true, 'id' => $id]);
?>
