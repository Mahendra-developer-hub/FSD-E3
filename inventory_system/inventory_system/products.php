<?php
require_once 'config/db.php';
include 'includes/header.php';

// Handle Delete
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $conn->query("DELETE FROM products WHERE product_id = $id");
    header("Location: products.php");
}

// Handle Add
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['add_product'])) {
    $name = $_POST['product_name'];
    $cat = $_POST['category'];
    $price = $_POST['price'];
    $qty = $_POST['quantity'];

    $sql = "INSERT INTO products (product_name, category, price, quantity) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssdi", $name, $cat, $price, $qty);
    $stmt->execute();
}
?>

<h1>Product Management</h1>

<div class="form-container">
    <h3>Add New Product</h3>
    <form method="POST">
        <input type="text" name="product_name" placeholder="Product Name" required>
        <input type="text" name="category" placeholder="Category">
        <input type="number" step="0.01" name="price" placeholder="Price" required>
        <input type="number" name="quantity" placeholder="Initial Quantity" required>
        <button type="submit" name="add_product">Add Product</button>
    </form>
</div>

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $result = $conn->query("SELECT * FROM products");
        while($row = $result->fetch_assoc()) {
            echo "<tr>
                    <td>{$row['product_id']}</td>
                    <td>{$row['product_name']}</td>
                    <td>{$row['category']}</td>
                    <td>\${$row['price']}</td>
                    <td>{$row['quantity']}</td>
                    <td>
                        <a href='products.php?delete={$row['product_id']}' onclick='return confirm(\"Are you sure?\")' style='color:red'>Delete</a>
                    </td>
                  </tr>";
        }
        ?>
    </tbody>
</table>

</main>
</body>
</html>
