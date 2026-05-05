<?php
session_start();
require_once 'config/db.php';

// 1. Validation: Check if user is logged in and cart isn't empty
if (!isset($_SESSION['user_id']) || empty($_SESSION['cart'])) {
    header("Location: view_products.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$address = $_POST['address'] ?? 'No Address Provided';
$total_price = $_POST['total_amount'] ?? 0;

// 2. Insert into 'orders' table
$stmt = $conn->prepare("INSERT INTO orders (user_id, total_amount, address, status) VALUES (?, ?, ?, 'Pending')");
$stmt->bind_param("ids", $user_id, $total_price, $address);

if ($stmt->execute()) {
    $order_id = $conn->insert_id;

    // 3. Process each item in the cart
    foreach ($_SESSION['cart'] as $p_id => $qty) {
        
        // Fetch current product details safely
        $prod_query = $conn->prepare("SELECT price, quantity FROM products WHERE product_id = ?");
        $prod_query->bind_param("i", $p_id);
        $prod_query->execute();
        $res = $prod_query->get_result();
        
        if ($product = $res->fetch_assoc()) {
            $price = $product['price'];
            $current_stock = $product['quantity'];

            // Optional: Check if enough stock exists before proceeding
            if ($current_stock >= $qty) {
                $new_qty = $current_stock - $qty;

                // Insert into order_items
                $item_stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
                $item_stmt->bind_param("iiid", $order_id, $p_id, $qty, $price);
                $item_stmt->execute();

                // Update product stock
                $stock_stmt = $conn->prepare("UPDATE products SET quantity = ? WHERE product_id = ?");
                $stock_stmt->bind_param("ii", $new_qty, $p_id);
                $stock_stmt->execute();
            }
        }
    }

    // 4. Cleanup and Redirect
    unset($_SESSION['cart']);
    echo "<script>alert('Order Placed Successfully!'); window.location.href='orders.php';</script>";
} else {
    // This will now show specific SQL errors if they occur
    die("Execution failed: " . $stmt->error);
}
?>