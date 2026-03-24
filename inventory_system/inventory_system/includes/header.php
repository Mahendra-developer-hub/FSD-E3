<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory System</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav class="sidebar">
        <h2>StockTrack</h2>
        <ul>
            <li><a href="index.php">Dashboard</a></li>
            <li><a href="products.php">Products</a></li>
            <li><a href="suppliers.php">Suppliers</a></li>
            <li><a href="update_stock.php">Update Stock</a></li>
            <li><a href="logout.php" class="logout-btn">Logout</a></li>
        </ul>
    </nav>
    <main class="content">
