<?php
session_start();
require_once 'config/db.php';

// FIX 1: Use 'user_id' to match your login session and database
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// FIX 2: Match your database column name 'user_id'
$sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
?>

<!DOCTYPE html>
<html>
<head>
    <title>My Orders</title>
    <link rel="stylesheet" href="css/customer.css">
    <style>
        /* Ensuring the cards look clean */
        .card-box {
            background: #fff;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            border-left: 5px solid #2c3e50;
        }
    </style>
</head>
<body>

<div class="dashboard">

    <div class="sidebar">
        <h2>Menu</h2>
        <a href="customer_dashboard.php">Dashboard</a>
        <a href="view_products.php">Products</a>
        <a href="cart.php">Cart</a>
        <a href="logout.php">Logout</a>
    </div>

    <div class="main-content">
        <h1>My Orders 📦</h1>

        <?php if ($result->num_rows > 0) { 
            while($row = $result->fetch_assoc()) { ?>
                <div class="card-box">
                    <p><strong>Order ID:</strong> #<?php echo $row['id']; ?></p>
                    <p><strong>Total:</strong> ₹<?php echo number_format($row['total_amount'], 2); ?></p>
                    <p><strong>Date:</strong> <?php echo date('d M Y, h:i A', strtotime($row['created_at'])); ?></p>
                    <p><strong>Status:</strong> <?php echo $row['status'] ?? 'Pending'; ?></p>
                </div>
            <?php } 
        } else { ?>
            <p>No orders found. Start shopping!</p>
        <?php } ?>

    </div>

</div>

</body>
</html>