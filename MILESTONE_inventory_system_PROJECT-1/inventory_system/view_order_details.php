<?php
session_start();
require_once 'config/db.php';

$order_id = $_GET['id'] ?? 0;

// JOIN order_items with products to get the name of the product bought
$sql = "SELECT oi.*, p.product_name 
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.product_id 
        WHERE oi.order_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Items for Order #<?php echo $order_id; ?></title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .container { width: 70%; margin: 50px auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 15px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
        .back-link { display: inline-block; margin-top: 20px; color: #e74c3c; text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Order Details Breakdown (#<?php echo $order_id; ?>)</h2>
        <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                <?php 
                $grand_total = 0;
                while($item = $result->fetch_assoc()): 
                    $subtotal = $item['price'] * $item['quantity'];
                    $grand_total += $subtotal;
                ?>
                <tr>
                    <td><?php echo htmlspecialchars($item['product_name']); ?></td>
                    <td>₹<?php echo number_format($item['price'], 2); ?></td>
                    <td><?php echo $item['quantity']; ?></td>
                    <td>₹<?php echo number_format($subtotal, 2); ?></td>
                </tr>
                <?php endwhile; ?>
                <tr style="background:#f9f9f9; font-weight:bold;">
                    <td colspan="3" style="text-align:right;">Order Total:</td>
                    <td>₹<?php echo number_format($grand_total, 2); ?></td>
                </tr>
            </tbody>
        </table>
        <a href="admin_orders.php" class="back-link">← Back to Orders List</a>
    </div>
</body>
</html>