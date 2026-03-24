<?php
require_once 'config/db.php';
include 'includes/header.php';

// Handle Add
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['add_supplier'])) {
    $name = $_POST['supplier_name'];
    $phone = $_POST['phone'];
    $address = $_POST['address'];

    $sql = "INSERT INTO suppliers (supplier_name, phone, address) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $name, $phone, $address);
    $stmt->execute();
}
?>

<h1>Supplier Management</h1>

<div class="form-container">
    <h3>Add New Supplier</h3>
    <form method="POST">
        <input type="text" name="supplier_name" placeholder="Supplier Name" required>
        <input type="text" name="phone" placeholder="Phone Number">
        <textarea name="address" placeholder="Address"></textarea>
        <button type="submit" name="add_supplier">Add Supplier</button>
    </form>
</div>

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $result = $conn->query("SELECT * FROM suppliers");
        while($row = $result->fetch_assoc()) {
            echo "<tr>
                    <td>{$row['supplier_id']}</td>
                    <td>{$row['supplier_name']}</td>
                    <td>{$row['phone']}</td>
                    <td>{$row['address']}</td>
                  </tr>";
        }
        ?>
    </tbody>
</table>

</main>
</body>
</html>
