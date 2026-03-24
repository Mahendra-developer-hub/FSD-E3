<?php
session_start();
if (!isset($_SESSION['customer_id'])) {
    header("Location: customer_login.php");
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Customer Dashboard</title>
    <link rel="stylesheet" href="css/customer.css">
</head>

<body>

<div class="dashboard">

    <div class="sidebar">
        <h2>My Account</h2>
        <a href="customer_dashboard.php">Dashboard</a>
        <a href="view_products.php">Products</a>
        <a href="cart.php">Cart</a>
        <a href="orders.php">My Orders</a>
        <a href="logout.php">Logout</a>
    </div>

    <div class="main-content">
        <h1>Welcome, <?php echo $_SESSION['customer_name']; ?> 👋</h1>

        <div class="cards">
            <div class="card-box">🛒 View Products</div>
            <div class="card-box">📦 My Orders</div>
            <div class="card-box">💳 Cart</div>
        </div>
    </div>

</div>

</body>
</html>