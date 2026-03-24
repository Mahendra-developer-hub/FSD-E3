<?php
require_once 'config/db.php';
include 'includes/header.php';

$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $product_id = $_POST['product_id'];
    $amount = $_POST['amount'];
    $type = $_POST['type'];

    // Update product quantity
    if ($type == 'IN') {
        $sql = "UPDATE products SET quantity = quantity + ? WHERE product_id = ?";
    } else {
        $sql = "UPDATE products SET quantity = quantity - ? WHERE product_id = ?";
    }
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $amount, $product_id);
    
    if ($stmt->execute()) {
        // Record transaction
        $log_sql = "INSERT INTO stock_transactions (product_id, change_amount, transaction_type) VALUES (?, ?, ?)";
        $log_stmt = $conn->prepare($log_sql);
        $log_stmt->bind_param("iis", $product_id, $amount, $type);
        $log_stmt->execute();
        $message = "Stock updated successfully!";
    }
}
?>

<h1>Update Stock</h1>

<?php if($message) echo "<p style='color:green; margin-bottom:20px;'>$message</p>"; ?>

<div class="form-container">
    <form method="POST">
        <label>Select Product</label>
        <select name="product_id" required>
            <?php
            $prods = $conn->query("SELECT product_id, product_name FROM products");
            while($p = $prods->fetch_assoc()) {
                echo "<option value='{$p['product_id']}'>{$p['product_name']}</option>";
            }
            ?>
        </select>

        <label>Transaction Type</label>
        <select name="type" required>
            <option value="IN">Stock In (Addition)</option>
            <option value="OUT">Stock Out (Sale/Removal)</option>
        </select>

        <label>Quantity</label>
        <input type="number" name="amount" placeholder="Enter quantity" required>

        <button type="submit">Update Stock</button>
    </form>
</div>

</main>
</body>
</html>
