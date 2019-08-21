<?php
 ini_set ('display_errors', 'on');
 ini_set ('log_errors', 'on');
 ini_set ('display_startup_errors', 'on');
 ini_set ('error_reporting', E_ALL);
// Use in the “Post-Receive URLs” section of your GitHub repo.

if ( $_POST['payload'] ) {
	shell_exec("cd /var/www/ && git reset –hard HEAD && git pull");
}

?>