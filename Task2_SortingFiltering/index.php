<?php
$conn = new mysqli("localhost", "root", "", "Task2_SortingFiltering");

if ($conn->connect_error) {
    die("Connection failed");
}

$order = "";
$filter = "";

if(isset($_GET['sort'])) {
    $order = " ORDER BY name " . $_GET['sort'];
}

if(isset($_GET['department']) && $_GET['department'] != "") {
    $filter = " WHERE department = '" . $_GET['department'] . "'";
}

$sql = "SELECT * FROM student" . $filter . $order;
$result = mysqli_query($conn, $sql);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Task 2 - Sorting & Filtering</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<h2>Task 2 - Sorting & Filtering</h2>

<a href="?sort=ASC">Sort Name A-Z</a> |
<a href="?sort=DESC">Sort Name Z-A</a>

<br><br>

<form method="GET">
    <label>Filter by Department:</label>
    <select name="department">
        <option value="">All</option>
        <option value="CSE">CSE</option>
        <option value="IT">IT</option>
        <option value="ECE">ECE</option>
        <option value="EEE">EEE</option>
    </select>
    <button type="submit">Filter</button>
</form>

<br>

<table border="1" cellpadding="10">
<tr>
    <th>Name</th>
    <th>Email</th>
    <th>DOB</th>
    <th>Department</th>
    <th>Phone</th>
</tr>

<?php
while ($row = mysqli_fetch_assoc($result)) {
    echo "<tr>
            <td>{$row['name']}</td>
            <td>{$row['email']}</td>
            <td>{$row['dob']}</td>
            <td>{$row['department']}</td>
            <td>{$row['phone']}</td>
          </tr>";
}

$conn->close();
?>

</table>

</body>
</html>
