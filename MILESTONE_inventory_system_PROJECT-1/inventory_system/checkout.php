<?php
session_start();
require_once 'config/db.php';

// If cart is empty, send them back to products
if (!isset($_SESSION['cart']) || empty($_SESSION['cart'])) {
    header("Location: view_products.php");
    exit();
}

$cart_items = $_SESSION['cart'];
$grand_total = 0;
?>

<!DOCTYPE html>
<html>
<head>
    <title>Checkout</title>
    <link rel="stylesheet" href="css/customer.css">
</head>
<body>

<div class="dashboard">
    <div class="main-content" style="width: 80%; margin: 0 auto; padding-top: 50px;">
        <h1>Order Summary</h1>
        
        <table border="1" cellpadding="10" style="width:100%; border-collapse: collapse;">
            <tr style="background-color: #f2f2f2;">
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
            </tr>
            <?php 
            foreach ($cart_items as $id => $quantity): 
                $res = $conn->query("SELECT * FROM products WHERE product_id = $id");
                if ($res && $product = $res->fetch_assoc()):
                    $subtotal = $product['price'] * $quantity;
                    $grand_total += $subtotal;
            ?>
            <tr>
                <td><?= htmlspecialchars($product['product_name']) ?></td>
                <td><?= $quantity ?></td>
                <td>₹<?= number_format($product['price'], 2) ?></td>
                <td>₹<?= number_format($subtotal, 2) ?></td>
            </tr>
            <?php endif; endforeach; ?>
            <tr>
                <td colspan="3" align="right"><strong>Total Amount to Pay:</strong></td>
                <td><strong>₹<?= number_format($grand_total, 2) ?></strong></td>
            </tr>
        </table>

        <div style="margin-top: 30px; border: 1px solid #ccc; padding: 20px; border-radius: 8px;">
            <h3>Shipping Details</h3>
            <form action="place_order.php" method="POST">
                <p><strong>Customer Name:</strong> <?= $_SESSION['user_name'] ?? 'Guest' ?></p>
                <label>Shipping Address:</label><br>
                <textarea name="address" required style="width: 100%; height: 80px; margin-top: 10px;"></textarea>
                <br><br>
                <input type="hidden" name="total_amount" value="<?= $grand_total ?>">
                <button type="submit" style="background-color: orange; color: white; padding: 15px 30px; border: none; cursor: pointer; font-size: 16px; border-radius: 5px;">Confirm & Place Order</button>
            </form>
        </div>
    </div>
</div>

</body>
</html>