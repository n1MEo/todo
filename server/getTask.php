<?php
$filename = 'tasks.txt';

if (!file_exists($filename)) {
    echo json_encode([]);
    exit;
}

$content = file_get_contents($filename);
if (empty($content)) {
    echo json_encode([]);
    exit;
}

$tasks = json_decode($content, true);

if (!is_array($tasks)) {
    $tasks = [];
}

echo json_encode($tasks, JSON_UNESCAPED_UNICODE);
?>