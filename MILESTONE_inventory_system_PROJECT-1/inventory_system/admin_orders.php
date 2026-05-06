<?php
session_start();
require_once 'config/db.php';

// Handle Status Update Request
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['update_status'])) {
    $order_id = $_POST['order_id'];
    $new_status = $_POST['status'];
    $update_stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $update_stmt->bind_param("si", $new_status, $order_id);
    $update_stmt->execute();
    header("Location: admin_orders.php?success=1");
    exit();
}

// SQL JOIN to get Username and Order details
$sql = "SELECT orders.id, users.username, orders.total_amount, orders.address, orders.created_at, orders.status 
        FROM orders 
        JOIN users ON orders.user_id = users.id 
        ORDER BY orders.created_at DESC";

$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin - Customer Orders</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .order-table { width: 95%; margin: 20px auto; border-collapse: collapse; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .order-table th, .order-table td { padding: 12px; border: 1px solid #eee; text-align: left; }
        .order-table th { background-color: #2c3e50; color: white; }
        .status-select { padding: 5px; border-radius: 4px; border: 1px solid #ccc; }
        .btn-view { color: #3498db; text-decoration: none; font-weight: bold; }
        .btn-update { background: #27ae60; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; }
    </style>
</head>
<body>

<div class="dashboard">
    <div class="main-content">
        <h1>Customer Order Management</h1>
        <?php if(isset($_GET['success'])) echo "<p style='color:green;'>Status updated successfully!</p>"; ?>

        <table class="order-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Total Amount</th>
                    <th>Address</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if ($result->num_rows > 0): ?>
                    <?php while($row = $result->fetch_assoc()): ?>
                        <tr>
                            <td>#<?php echo $row['id']; ?></td>
                            <td><strong><?php echo htmlspecialchars($row['username']); ?></strong></td>
                            <td>₹<?php echo number_format($row['total_amount'], 2); ?></td>
                            <td><?php echo htmlspecialchars($row['address']); ?></td>
                            <td><?php echo date('M d, Y', strtotime($row['created_at'])); ?></td>
                            <td>
                                <form method="POST" style="display:inline;">
                                    <input type="hidden" name="order_id" value="<?php echo $row['id']; ?>">
                                    <select name="status" class="status-select">
                                        <option value="Pending" <?php if($row['status'] == 'Pending') echo 'selected'; ?>>Pending</option>
                                        <option value="Shipped" <?php if($row['status'] == 'Shipped') echo 'selected'; ?>>Shipped</option>
                                        <option value="Delivered" <?php if($row['status'] == 'Delivered') echo 'selected'; ?>>Delivered</option>
                                    </select>
                                    <button type="submit" name="update_status" class="btn-update">Save</button>
                                </form>
                            </td>
                            <td>
                                <a href="view_order_details.php?id=<?php echo $row['id']; ?>" class="btn-view">View Items</a>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                <?php else: ?>
                    <tr><td colspan="7" style="text-align:center;">No orders found.</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>
</body>
</html>