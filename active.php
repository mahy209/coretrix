<?php

// constants
$database_username = "id4863580_ziadalzarka";
$database_password = "loVeA6irl";
$database_name = "id4863580_grayapps";
$database_table = "coretrix";

// database connection
$db = new mysqli("localhost", $database_username, $database_password, $database_name);

// extract data from request
$uuid = $_GET["uuid"];
$name = $_GET["name"];

// responses
function allow() {
  global $uuid;
  global $name;
  $payload = sprintf("%s:%s", $name, $uuid);
  $hash = password_hash($payload, PASSWORD_BCRYPT);
  print($hash);
  exit;
}

function deny() {
  exit;
}

// query name
$sql = sprintf("select `uuid` from `%s` where name='%s' and disabled=0", $database_table, $name);
$rows = $db->query($sql);

// CASE: doesn't exist
if ($rows->num_rows <= 0) {
  deny();
}

// CASE: first use
$result = $rows->fetch_assoc();
if ($result['uuid'] == null) {
  $sql = sprintf("update `%s` set `uuid`='%s' where name='%s'", $database_table, $uuid, $name);
  $db->query($sql);
  allow();
}

// CASE: usual check
if ($result['uuid'] == $uuid) {
  allow();
}

// CASE: mismatching uuid
deny();

?>