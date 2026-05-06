<?php
session_start();
require_once 'config/db.php';

$cart_items = isset($_SESSION['cart']) ? $_SESSION['cart'] : [];
?>

<!DOCTYPE html>
<html>
<head>
    <title>My Cart</title>
    <link rel="stylesheet" href="css/customer.css">
</head>
<body>

<div class="dashboard">
    <div class="sidebar">
        <h2>My Account</h2>
        <a href="customer_dashboard.php">Dashboard</a>
        <a href="view_products.php">Products</a>
        <a href="orders.php">My Orders</a>
        <a href="logout.php">Logout</a>
    </div>

    <div class="main-content">
        <h1>My Cart 🛒</h1>

        <?php if (empty($cart_items)): ?>
            <p>Your cart is empty 😔</p>
            <a href="view_products.php">Go Shopping</a>
        <?php else: ?>
            <table border="1" cellpadding="10" style="width:100%; border-collapse: collapse;">
                <tr style="background-color: #f2f2f2;">
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
                <?php 
                $grand_total = 0;
                foreach ($cart_items as $id => $quantity): 
                    // Query uses product_id to match your database structure
                    $res = $conn->query("SELECT * FROM products WHERE product_id = $id");
                    
                    if ($res && $product = $res->fetch_assoc()):
                        $subtotal = $product['price'] * $quantity;
                        $grand_total += $subtotal;
                ?>
                <tr>
                    <td><?php echo htmlspecialchars($product['product_name']); ?></td>
                    <td><?php echo $quantity; ?></td>
                    <td>₹<?php echo number_format($product['price'], 2); ?></td>
                    <td>₹<?php echo number_format($subtotal, 2); ?></td>
                </tr>
                <?php 
                    endif;
                endforeach; 
                ?>
                <tr style="background-color: #eee;">
                    <td colspan="3" align="right"><strong>Grand Total:</strong></td>
                    <td><strong>₹<?php echo number_format($grand_total, 2); ?></strong></td>
                </tr>
            </table>
            
            <div style="margin-top: 20px;">
                <a href="view_products.php" class="btn">Continue Shopping</a>
                <a href="checkout.php" class="btn" style="background-color: green; color: white; padding: 10px; text-decoration: none; border-radius: 5px; margin-left: 10px;">Proceed to Checkout</a>
            </div>
        <?php endif; ?>
    </div>
</div>

</body>
</html>