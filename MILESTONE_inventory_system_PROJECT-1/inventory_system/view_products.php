<?php
session_start();
require_once 'config/db.php';

// Enable error reporting to catch issues early
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Fetch products
$result = $conn->query("SELECT * FROM products");

if (!$result) {
    die("Database Error: " . $conn->error);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Products</title>
    <link rel="stylesheet" href="css/customer.css">
</head>

<body>

<div class="dashboard">

    <div class="sidebar">
        <h2>Menu</h2>
        <a href="customer_dashboard.php">Dashboard</a>
        <a href="cart.php">Cart</a>
        <a href="orders.php">Orders</a>
        <a href="logout.php">Logout</a>
    </div>

    <div class="main-content">
        <h1>Products</h1>

        <div class="cards">

        <?php if ($result->num_rows > 0): ?>

            <?php while ($row = $result->fetch_assoc()): ?>

                <div class="card-box">
                    <h3><?php echo htmlspecialchars($row['product_name']); ?></h3>
                    <p>Price: ₹<?php echo htmlspecialchars($row['price']); ?></p>
                    <p>Stock: <?php echo htmlspecialchars($row['quantity']); ?></p>

                    <form action="add_to_cart.php" method="POST">
    <?php 
    // FIXED: Changed 'id' to 'product_id' to match your DB and cart.php
    $p_id = isset($row['product_id']) ? $row['product_id'] : 0; 
    ?>
    <input type="hidden" name="product_id" value="<?php echo $p_id; ?>">
    <button type="submit">Add to Cart</button>
</form>
                </div>

            <?php endwhile; ?>

        <?php else: ?>
            <p>No products available</p>
        <?php endif; ?>

        </div>

    </div>

</div>

</body>
</html>