<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Use in the “Post-Receive URLs” section of your GitHub repo.


$output = shell_exec("cd /var/www/html && git pull origin master && npm install");

echo var_dump($output);

?>
