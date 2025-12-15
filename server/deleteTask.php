<?php
$taskText = $_POST['task_text'];
$filename = 'tasks.txt';

if (file_exists($filename)) {
    $content = file_get_contents($filename);
    $tasks = json_decode($content, true);
    
    $newTasks = [];
    foreach ($tasks as $task) {
        if ($task !== $taskText) {
            $newTasks[] = $task;
        }
    }
    
    file_put_contents($filename, json_encode($newTasks));
}

?>