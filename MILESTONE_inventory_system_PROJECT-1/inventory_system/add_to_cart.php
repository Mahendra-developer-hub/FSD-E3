<?php
session_start();
require_once 'config/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['product_id'])) {
    $product_id = $_POST['product_id'];

    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }

    if (isset($_SESSION['cart'][$product_id])) {
        $_SESSION['cart'][$product_id]++; 
    } else {
        $_SESSION['cart'][$product_id] = 1; 
    }

    header("Location: cart.php");
    exit();
} else {
    header("Location: view_products.php");
    exit();
}
?>