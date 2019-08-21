<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Use in the “Post-Receive URLs” section of your GitHub repo.

if ( $_POST['payload'] ) {
	shell_exec("cd /var/www/ && git reset –hard HEAD && git pull");
}

?>