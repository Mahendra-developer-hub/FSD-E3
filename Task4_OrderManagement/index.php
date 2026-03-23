<?php
$conn = new mysqli("localhost", "root", "", "Task4_OrderManagement");

if ($conn->connect_error) {
    die("Connection failed");
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Order Management</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<h2>Customer Order History</h2>

<table border="1" cellpadding="10">
<tr>
    <th>Customer</th>
    <th>Product</th>
    <th>Price</th>
    <th>Quantity</th>
    <th>Total</th>
</tr>

<?php
$sql = "SELECT c.name, p.product_name, p.price, o.quantity,
        (p.price * o.quantity) AS total
        FROM orders o
        JOIN customers c ON o.customer_id = c.customer_id
        JOIN products p ON o.product_id = p.product_id
        ORDER BY total DESC";

$result = mysqli_query($conn, $sql);

while($row = mysqli_fetch_assoc($result)) {
    echo "<tr>
            <td>{$row['name']}</td>
            <td>{$row['product_name']}</td>
            <td>{$row['price']}</td>
            <td>{$row['quantity']}</td>
            <td>{$row['total']}</td>
          </tr>";
}
?>
</table>

<br><br>

<h3>Highest Value Order</h3>

<?php
$sql2 = "SELECT MAX(p.price * o.quantity) AS highest
         FROM orders o
         JOIN products p ON o.product_id = p.product_id";

$result2 = mysqli_query($conn, $sql2);
$row2 = mysqli_fetch_assoc($result2);

echo "Highest Order Value: " . $row2['highest'];
?>

<br><br>

<h3>Most Active Customer</h3>

<?php
$sql3 = "SELECT c.name, COUNT(o.order_id) AS total_orders
         FROM orders o
         JOIN customers c ON o.customer_id = c.customer_id
         GROUP BY c.name
         ORDER BY total_orders DESC
         LIMIT 1";

$result3 = mysqli_query($conn, $sql3);
$row3 = mysqli_fetch_assoc($result3);

echo "Most Active Customer: " . $row3['name'];
$conn->close();
?>

</body>
</html>
