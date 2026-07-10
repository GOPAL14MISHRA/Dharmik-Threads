<?php
require_once 'helper.php';

$email = strtolower(trim($_GET['email'] ?? ''));

if (!$email) {
    sendResponse([]);
}

$sentEmails = getJsonFile('sent_emails.json');
$notifications = [];

foreach ($sentEmails as $id => $data) {
    if (isset($data['to']) && $data['to'] === $email) {
        $notifications[] = array_merge(['id' => $id], $data);
    }
}

usort($notifications, function($a, $b) {
    $timeA = strtotime($a['sentAt'] ?? '');
    $timeB = strtotime($b['sentAt'] ?? '');
    return $timeB - $timeA;
});

sendResponse($notifications);
?>
