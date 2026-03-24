<?php
require_once 'config/db.php';

$id = $_GET['id'];

$sql = "DELETE FROM cart WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();

header("Location: cart.php");
?>