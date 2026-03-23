<?php
$conn = new mysqli("localhost", "root", "", "Task1_StudentRegistration");

if ($conn->connect_error) {
    die("Connection failed");
}
?>

<h3>Registered Students</h3>

<table border="1" cellpadding="10">
    <tr>
        <th>Name</th>
        <th>Email</th>
        <th>DOB</th>
        <th>Department</th>
        <th>Phone</th>
    </tr>

<?php
$result = mysqli_query($conn, "SELECT * FROM student");

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
