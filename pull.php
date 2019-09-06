<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Use in the “Post-Receive URLs” section of your GitHub repo.


shell_exec("cd /var/www/html && git pull origin master");
shell_exec("cd /var/www/html && npm install");
echo "OK";

?>
