<?php
$taskText = $_POST['task_text'];

$filename = 'tasks.txt';
$tasks = [];

if (file_exists($filename)) {
    $content = file_get_contents($filename);
    if (!empty($content)) {
        $tasks = json_decode($content, true);
    }
}

$tasks[] = $taskText;

file_put_contents($filename, json_encode($tasks, JSON_UNESCAPED_UNICODE));

echo json_encode(['success' => true]);
?>