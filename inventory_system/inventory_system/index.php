<?php
include 'config/db.php';

// Fetch Stats
$prod_count = $conn->query("SELECT COUNT(*) as total FROM products")->fetch_assoc()['total'];
$supp_count = $conn->query("SELECT COUNT(*) as total FROM suppliers")->fetch_assoc()['total'];
$stock_total = $conn->query("SELECT SUM(quantity) as total FROM products")->fetch_assoc()['total'] ?? 0;

// Fetch Recent Orders
$recent_orders = $conn->query("SELECT orders.id, users.username, orders.total_amount, orders.created_at 
                               FROM orders 
                               JOIN users ON orders.user_id = users.id 
                               ORDER BY orders.created_at DESC LIMIT 5");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>StockTrack Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        body { display: flex; background-color: #f4f7f6; min-height: 100vh; }
        
        /* Sidebar */
        .sidebar { width: 260px; background-color: #2c3e50; color: white; position: fixed; height: 100%; padding: 20px; }
        .sidebar h2 { color: #3498db; margin-bottom: 30px; text-align: center; }
        .sidebar a { display: block; color: #bdc3c7; text-decoration: none; padding: 12px; border-radius: 4px; margin-bottom: 5px; }
        .sidebar a:hover, .sidebar a.active { background: #34495e; color: white; }

        /* Main Content Area */
        .main-content { margin-left: 260px; flex: 1; padding: 30px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        
        /* Stats Cards */
        .card-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
        .card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-top: 4px solid #3498db; }
        .card h3 { color: #7f8c8d; font-size: 14px; text-transform: uppercase; margin-bottom: 10px; }
        .card p { font-size: 28px; font-weight: bold; color: #2c3e50; }

        /* Tables */
        .section-box { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 30px; }
        .section-box h2 { font-size: 18px; margin-bottom: 20px; color: #2c3e50; border-left: 4px solid #3498db; padding-left: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f8f9fa; color: #7f8c8d; text-align: left; padding: 12px; font-size: 13px; text-transform: uppercase; }
        td { padding: 15px 12px; border-bottom: 1px solid #eee; color: #333; font-size: 15px; }
        tr:hover { background-color: #fcfcfc; }
    </style>
</head>
<body>

    <div class="sidebar">
        <h2>StockTrack</h2>
        <a href="index.php" class="active">Dashboard</a>
        <a href="view_products.php">Products</a>
        <a href="suppliers.php">Suppliers</a>
        <a href="admin_orders.php">Customer Orders</a>
        <a href="update_stock.php">Update Stock</a>
        <a href="logout.php" style="margin-top: 50px; color: #e74c3c;">Logout</a>
    </div>

    <div class="main-content">
        <div class="header">
            <h1>Admin Dashboard</h1>
            <div class="user-links">
                <a href="customer_login.php" style="text-decoration:none; color:#3498db;">Switch to Customer View</a>
            </div>
        </div>

        <div class="card-container">
            <div class="card">
                <h3>Total Products</h3>
                <p><?php echo $prod_count; ?></p>
            </div>
            <div class="card" style="border-top-color: #27ae60;">
                <h3>Total Suppliers</h3>
                <p><?php echo $supp_count; ?></p>
            </div>
            <div class="card" style="border-top-color: #f39c12;">
                <h3>Items in Stock</h3>
                <p><?php echo $stock_total; ?></p>
            </div>
        </div>

        <div class="section-box">
            <h2>Recent Customer Orders</h2>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($recent_orders->num_rows > 0): ?>
                        <?php while($order = $recent_orders->fetch_assoc()): ?>
                            <tr>
                                <td>#<?php echo $order['id']; ?></td>
                                <td><strong><?php echo htmlspecialchars($order['username']); ?></strong></td>
                                <td>₹<?php echo number_format($order['total_amount'], 2); ?></td>
                                <td><?php echo date('d M, h:i A', strtotime($order['created_at'])); ?></td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="4" style="text-align:center; color:#999;">No orders yet.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <div class="section-box">
            <h2>Recent Stock Activity</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Change</th>
                        <th>Type</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $sql = "SELECT p.product_name, s.change_amount, s.transaction_type, s.date_created 
                            FROM stock_transactions s 
                            JOIN products p ON s.product_id = p.product_id 
                            ORDER BY s.date_created DESC LIMIT 5";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0):
                        while($row = $result->fetch_assoc()): ?>
                            <tr>
                                <td><?php echo $row['product_name']; ?></td>
                                <td><?php echo $row['change_amount']; ?></td>
                                <td><?php echo $row['transaction_type']; ?></td>
                                <td><?php echo date('d M, Y', strtotime($row['date_created'])); ?></td>
                            </tr>
                        <?php endwhile; 
                    else: ?>
                        <tr><td colspan="4" style="text-align:center; color:#999;">No recent activity.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

</body>
</html>