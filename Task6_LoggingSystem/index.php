<?php
$conn = new mysqli("localhost", "root", "", "Task6_LoggingSystem");

if ($conn->connect_error) {
    die("Connection failed");
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Task 6 - Logging System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<h2>Daily Activity Report</h2>

<table border="1" cellpadding="10">
<tr>
    <th>Date</th>
    <th>Action Type</th>
    <th>Total Actions</th>
</tr>

<?php
$result = mysqli_query($conn, "SELECT * FROM daily_activity");

while($row = mysqli_fetch_assoc($result)) {
    echo "<tr>
            <td>{$row['activity_date']}</td>
            <td>{$row['action_type']}</td>
            <td>{$row['total_actions']}</td>
          </tr>";
}

$conn->close();
?>

</table>

</body>
</html>
